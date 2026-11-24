<template>
    <div class="team-container">
        <h2>Team Members</h2>

        <div class="team-table-wrap">
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <!-- <th>Bio</th> -->
                    <th>Qualification</th>
                    <th>LinkedIn URL</th>
                    <th>Image</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                <!-- <tr>
                    <td>1</td>
                    <td>Adarsh Gupta</td>
                    <td>Product Development</td>
                    <td>Laravel developer</td>
                    <td>BCA</td>
                    <td>
                        <a href="https://in.linkedin.com/" target="_blank">
                            LinkedIn
                        </a>
                    </td>
                    <td>Null</td>
                    <td>
                        <button
                            class="btn editpill"
                            @click="openModal"
                        >
                            Edit
                        </button>

                        <button class="btn deletepill">
                            Delete
                        </button>
                    </td>
                </tr> -->
                <tr v-for="(mem,index) in filteredMembers" :key="mem.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ mem.firstname}}{{  mem.lastname }}</td>
                    <td>{{ mem.designation }}</td>
                    <!-- <td class="bio-text">{{ mem.bio }}</td> -->
                    <td>{{ mem.qualification ?? "-" }}</td>
                    <td>
                        <a v-if="mem.linkdin_url" :href="mem.linkdin_url" target="_blank">
                            LinkedIn
                        </a>
                    </td>
                    <!-- <td><img v-if="mem.image" :src="`/storage/${mem.image}`" alt="employee-image" width="50" height="50"/></td> -->
                    <!-- <td><img v-if="mem.image" :src="mem.image_url" alt="employee-image" width="50" height="50"/></td> -->
                    <td><img class="image" v-if="mem.image" :src="`https://biltrax-dev-uploads.s3.ap-south-1.amazonaws.com/${mem.image}`" alt="employee-image" width="50" height="50"/></td>
                    <td>
                        <button
                            class="btn editpill"
                            @click="getSingleMemeber(mem.id)"
                        >
                        <Pencil :size="15"/>
                        </button>

                        <button class="btn deletepill" @click="deleteMember(mem.id)" >
                            <Trash :size="15"/>
                        </button>
                    </td>

                </tr>
                <tr v-if="filteredMembers.length === 0">
                    <td colspan="8" style="text-align: center;"> {{ props.search.trim()
            ? 'No team members match your search.'
            : 'No team members found.' }}</td>
                </tr>
            </tbody>
        </table>
        </div>

        <!-- Modal -->
        <Transition name="modal">
            <div
                v-if="showModal || isEditModalOpen"
                class="modal-overlay"
            >
                <div class="modal-box">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h2>{{ isEditMode ? 'Edit Team Memebr' :'Add Team Member' }}</h2>

                        <button
                            type="button"
                            class="close-btn"
                            @click="closeModal"
                        >
                            &times;
                        </button>
                    </div>

                    <!-- Modal Form -->
                    <form @submit.prevent=" isEditMode ? updateMember():saveMember()">

                        <div class="form-grid">

                            <div class="form-group">
                                <label for="member-firstname">First Name</label>
                                <input
                                    id="member-firstname"
                                    v-model="form.Firstname"
                                    type="text"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="member-lastname">Last Name</label>
                                <input
                                    id="member-lastname"
                                    v-model="form.Lastname"
                                    type="text"
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="designation">Designation</label>
                                <input
                                    id="designation"
                                    v-model="form.designation"
                                    type="text"
                                    placeholder="Enter designation"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="qualification">Qualification</label>
                                <input
                                    id="qualification"
                                    v-model="form.qualification"
                                    type="text"
                                    placeholder="Enter qualification"
                                    
                                />
                            </div>

                            <div class="form-group full-width">
                                <label for="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    v-model="form.bio"
                                    rows="3"
                                    placeholder="Enter bio"
                                ></textarea>
                            </div>

                            <div class="form-group full-width">
                                <label for="linkedin">LinkedIn URL</label>
                                <input
                                    id="linkedin"
                                    v-model="form.linkedin"
                                    type="url"
                                    placeholder="https://in.linkedin.com/in/..."
                                />
                            </div>

                            <div class="form-group full-width">
                                <label for="image">Image</label>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    @change="handleImage"
                                />

                                <p v-if="form.imageName" class="file-name">
                                    Selected: {{ form.imageName }}
                                </p>
                            </div>

                        </div>

                        <!-- Modal Footer -->
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="cancel-btn"
                                @click="closeModal"
                            >
                                Cancel
                            </button>

                            <button type="submit" class="save-btn" :disabled="isSubmitting">
                               {{ isSubmitting ? 'Please wait...': isEditMode ? 'Update Member':'Save Member' }}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { Pencil, Trash } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref, watch,computed } from 'vue';
const isSubmitting = ref(false);
const allMember = ref([]);
const SingleMember = ref(null);
const isEditMode  = ref(false);
const isEditModalOpen = ref(false);
const props = defineProps({
    showModal:{type:Boolean,default:false},
    search:{type:String,default:''}
})
const csrfToken = document.querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');


const emit = defineEmits(['close','memberCount']);

const form = reactive({
    Firstname: '',
    Lastname: '',
    designation: '',
    bio: '',
    qualification: '',
    linkedin: '',
    image: null,
    imageName: ''
})
watch(
    () => props.showModal,
    (isOpen) => {
        if (isOpen) {
            // Add mode: blank form
            Object.assign(form, {
                Firstname: '',
                Lastname: '',
                designation: '',
                bio: '',
                qualification: '',
                linkedin: '',
                image: null
            })
        }
    }
)

// Search Filterd Member;
const filteredMembers = computed(() => {
    const query = props.search.trim().toLowerCase();

    if (!query) {
        return allMember.value;
    }

    return allMember.value.filter((mem) => {
        const firstName = mem.firstname || '';
        const lastName = mem.lastname || '';
        const fullName = `${firstName} ${lastName}`.trim();

        const email = mem.email || mem.work_email || '';

        return (
            firstName.toLowerCase().includes(query) ||
            lastName.toLowerCase().includes(query) ||
            fullName.toLowerCase().includes(query) ||
            email.toLowerCase().includes(query)
        );
    });
});



function openModal() {
    form.id = 1
    form.name = 'Adarsh Gupta'
    form.designation = 'Product Development'
    form.bio = 'Laravel developer'
    form.qualification = 'BCA'
    form.linkedin = 'https://in.linkedin.com/'
    form.image = null
    form.imageName = ''
    showModal.value = true
}

function handleImage(event) {
    const file = event.target.files[0]

    if (file) {
        form.image = file
        form.imageName = file.name
    }
}

function closeModal() {
    // showModal.value = false
    isEditModalOpen.value = false;
    emit('close');
}


async function saveMember(e) {
    // e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    // Show processing SweetAlert
    Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we save the team member.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const formData = new FormData();

        formData.append('firstname', form.Firstname);
        formData.append('lastname', form.Lastname);
        formData.append('designation', form.designation);
        formData.append('bio', form.bio || '');
        formData.append('qualification', form.qualification || '');
        formData.append('linkdin', form.linkedin);

        if (form.image) {
            formData.append('image', form.image);
        }

        const res = await fetch('/cms-api/team-create', {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            }
        });

        const result = await res.json();

        if (!res.ok) {
            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: result.message || 'Failed to save team member.',
                confirmButtonColor: '#dc2626'
            });
            return;
        }
         closeModal();
        await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: result.message || 'Team member saved successfully!',
            confirmButtonText: 'OK',
            confirmButtonColor: '#4f46e5'
        });
        
        await getAllMember();
        // closeModal();

    } catch (error) {
        console.error('Error:', error);
         closeModal();
        await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Failed to save changes.',
            confirmButtonColor: '#dc2626'
        });

    } finally {
        isSubmitting.value = false;
    }
}

// Get all memeber data;

async function getAllMember() {
    try {
        // const csrfToken = document
        //     .querySelector('meta[name="csrf-token"]')
        //     ?.getAttribute('content');

        // console.log('CSRF Token:', csrfToken);

        const response = await fetch('/cms-api/team-member', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });

        const res = await response.json();
         allMember.value = res.data ?? [];

        if (!response.ok) {
            console.log('API Error:', response.status, res);
            return;
        }
         emit('memberCount', allMember.value.length);
    //   ``  console.log('Result:', allMember.value);
    } catch (e) {
        console.log('Error:', e.message);
    }
}

// Get Single Team Member:
async function getSingleMemeber(id) {
    try {
        const response = await fetch('/cms-api/single-member', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ id: id })
        });

        const res = await response.json();

        if (!response.ok) {
            throw new Error(res.message || 'Failed to fetch member');
        }

        // API se selected member ka data
        const member = res.data;

        if (!member) {
            throw new Error('Team member not found');
        }

        SingleMember.value = member;

        // Form mein existing values fill karo
        Object.assign(form, {
            id: member.id,
            Firstname: member.firstname ?? '',
            Lastname: member.lastname ?? '',
            designation: member.designation ?? '',
            bio: member.bio ?? '',
            qualification: member.qualification ?? '',
            linkedin: member.linkdin_url ?? member.linkdin ?? '',
            image: null,
            imageName: ''
        });

        isEditMode.value = true;
        isEditModalOpen.value = true;

    } catch (error) {
        console.error('Error fetching member:', error);

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

// Update single member();

async function updateMember() {
    if (isSubmitting.value) return;

    if (!form.id) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Member ID is missing.'
        });
        return;
    }

    isSubmitting.value = true;

    Swal.fire({
        title: 'Updating...',
        text: 'Please wait while we update the member.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const formData = new FormData();

        formData.append('id', form.id);
        formData.append('firstname', form.Firstname);
        formData.append('lastname', form.Lastname);
        formData.append('designation', form.designation);
        formData.append('bio', form.bio || '');
        formData.append('qualification', form.qualification || '');
        formData.append('linkdin', form.linkedin || '');

        // Image optional hai: sirf nayi image select hone par bhejo
        if (form.image instanceof File) {
            formData.append('image', form.image);
        }

        const response = await fetch('/cms-api/team-update', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken || ''
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            let message = result.message || 'Failed to update team member.';

            if (result.errors) {
                message = Object.values(result.errors)
                    .flat()
                    .join('\n');
            }

            throw new Error(message);
        }
        // Modal close
        closeModal();
        await Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: result.message || 'Team member updated successfully.',
            confirmButtonColor: '#20aa84'
        });

        // Table refresh
        await getAllMember();

        

    } catch (e) {
        console.error('Update error:', e.message);
         closeModal();
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: e.message || 'Something went wrong.',
            confirmButtonColor: '#dc2626'
        });

    } finally {
        isSubmitting.value = false;
    }
}

// Delete Recorde:

async function deleteMember(id) {
    try {
        // Confirmation before deleting
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This team member will be removed from the list.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280'
        });

        // User clicked Cancel
        if (!confirm.isConfirmed) {
            return;
        }

        Swal.fire({
            title: 'Deleting...',
            text: 'Please wait.',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await fetch('/cms-api/team-delete', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || ''
            },
            body: JSON.stringify({
                id: id
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Failed to delete team member.'
            );
        }

        await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: result.message || 'Team member deleted successfully.',
            confirmButtonColor: '#20aa84'
        });

        // Refresh table after deletion
        await getAllMember();

    } catch (e) {
        console.error('Delete error:', e.message);

        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: e.message || 'Something went wrong.',
            confirmButtonColor: '#dc2626'
        });
    }
}



onMounted(()=>{
    getAllMember();
    // getSingleMemeber();
});
// getAllMember();

</script>

<style scoped>
.team-container {
    min-width: 0;
    padding: 20px 11px;
    font-family: Arial, sans-serif;
    /* color: #1f2937; */
}

.team-container h2 {
    margin-bottom: 20px;
}

.bio-text {
    max-width: 200px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-word;
    line-height: 1.5;
}

table {
    width: 100%;
    min-width: 850px;
    border-collapse: collapse;
    /* background: white; */
}

.team-table-wrap {
    max-width: 100%;
    overflow-x: auto;
}

th,
td {
    padding: 7px 10px;
    /* border-bottom: 1px solid #898e98; */
    text-align: left;
}

th {
    /* background: #f8fafc; */
    font-size: 12px;
}

.btn {
    padding: 5px 7px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.editpill {
    color: #20aa84;
    background: #20aa841c;
    margin: 4px;
}

.deletepill {
    color: #d88b21;
    background: #d88b211f;
}

/* Modal Overlay */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    z-index: 9999 !important;
}

/* Modal Box */
.modal-box {
    width: 100%;
    max-width: 650px;
    max-height: 90vh;
    max-height: 90dvh;
    overflow-y: auto;
    background: var(--bg);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

/* Header */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
    font-size: 21px;
    margin: 0;
}

.close-btn {
    border: none;
    background: transparent;
    font-size: 30px;
    cursor: pointer;
    color: #64748b;
}

/* Form */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    padding: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
}

.form-group input,
.form-group textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #d1d5db;
    border-radius: 7px;
    outline: none;
    font-size: 14px;
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: #20aa84;
    box-shadow: 0 0 0 3px #20aa841c;
}

.form-group textarea {
    resize: vertical;
}

.full-width {
    grid-column: 1 / -1;
}

.file-name {
    margin: 0;
    font-size: 13px;
    color: #64748b;
}

/* Footer */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 18px 24px;
    border-top: 1px solid #e5e7eb;
}

.cancel-btn,
.save-btn {
    padding: 7px 7px;
    border-radius: 7px;
    cursor: pointer;
    font-weight: 600;
}

.cancel-btn {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
}

.save-btn {
    background: #207aaa;
    border: 1px solid #2077aa;
    color: white;
}

.save-btn:hover {
    background: #175f89;
}

/* Transition animation */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
    transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
    transform: translateY(15px);
}

.image{
     border: 1px solid #ccc;
    border-radius: 0.5rem;
}
.image:hover{
    box-shadow: 0 0 2px 1px var(--primary);
}


/* Mobile responsive */
@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .full-width {
        grid-column: auto;
    }

    .team-container {
        padding: 12px 0;
    }

    .modal-overlay {
        padding: 12px;
    }

    .modal-header,
    .modal-footer {
        padding: 14px 6px;
    }

    .form-grid {
        gap: 14px;
        padding: 16px;
    }

    .modal-footer {
        flex-wrap: wrap;
    }

    .modal-footer button {
        flex: 1;
        min-width: 110px;
    }
}
</style>