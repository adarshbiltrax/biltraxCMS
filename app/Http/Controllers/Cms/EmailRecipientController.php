<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EmailRecipientController extends Controller
{
    private function recipientType(string $type): string
    {
        abort_unless(in_array($type, ['enquiry', 'career', 'careers'], true), 404);

        return $type === 'careers' ? 'career' : $type;
    }

    // private function defaultRecipient(string $type): string
    // {
    //     return $type === 'enquiry' ? 'enquiry@biltrax.com' : 'careers@biltrax.com';
    // }

    private function recipients(string $type): array
    {
        $recipients = DB::table('email_recipient_addresses')
            ->where('type', $type)
            ->where('status', 1)
            ->orderBy('id')
            ->pluck('email')
            ->map(fn ($email) => trim($email))
            ->unique(fn ($email) => mb_strtolower($email))
            ->values()
            ->all();

        if ($recipients) {
            return $recipients;
        }

        // Preserve an existing single-recipient setting when moving to the
        // address table; otherwise seed the required category-specific default.
        // $column = $type === 'enquiry' ? 'enquiry_to' : 'careers_to';
        // $legacyRecipient = DB::table('email_recipient_settings')
        //     ->where('id', 1)
        //     ->value($column);
        // $email = mb_strtolower(trim($legacyRecipient ?: $this->defaultRecipient($type)));

        // DB::table('email_recipient_addresses')->insertOrIgnore([
        //     'type' => $type,
        //     'email' => $email,
        //     'status' => 1,
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        return DB::table('email_recipient_addresses')
            ->where('type', $type)
            ->where('status', 1)
            ->orderBy('id')
            ->pluck('email')
            ->all();
    }

    public function show(string $type)
    {
        $type = $this->recipientType($type);

        return response()->json([
            'type' => $type,
            'recipients' => $this->recipients($type),
        ]);
    }

    public function update(Request $request, string $type)
    {
        $type = $this->recipientType($type);
        $validated = $request->validate([
            'recipients' => ['required', 'array', 'min:1', 'max:20'],
            'recipients.*' => ['required', 'string', 'email:rfc', 'max:150'],
        ]);

        $recipients = array_map(
            fn ($email) => mb_strtolower(trim($email)),
            $validated['recipients']
        );
        if (count(array_unique($recipients)) !== count($recipients)) {
            throw ValidationException::withMessages([
                'recipients' => 'Recipient email addresses must be unique, ignoring letter case.',
            ]);
        }

        DB::transaction(function () use ($type, $recipients) {
            $now = now();
            $existingRows = DB::table('email_recipient_addresses')
                ->where('type', $type)
                ->orderBy('id')
                ->get();
            $existingByEmail = $existingRows->groupBy(fn ($row) => mb_strtolower($row->email));
            $keptIds = [];

            foreach ($recipients as $email) {
                $matches = $existingByEmail->get($email, collect());
                if ($matches->isNotEmpty()) {
                    $existing = $matches->first();
                    $keptIds[] = $existing->id;
                    DB::table('email_recipient_addresses')->where('id', $existing->id)->update([
                        'email' => $email,
                        'status' => 1,
                        'updated_at' => $now,
                    ]);
                    continue;
                }

                DB::table('email_recipient_addresses')->insert([
                    'type' => $type,
                    'email' => $email,
                    'status' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $removedIds = $existingRows->pluck('id')->diff($keptIds);
            if ($removedIds->isNotEmpty()) {
                DB::table('email_recipient_addresses')->whereIn('id', $removedIds)->update([
                     'status' => 0,
                     'updated_at' => now()
                ]);
            }
        });

        return response()->json([
            'message' => 'Email recipients saved successfully.',
            'type' => $type,
            'recipients' => $recipients,
        ]);
    }
}