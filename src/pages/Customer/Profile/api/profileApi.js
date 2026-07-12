import { userService } from '@/services';

export const profileApi = {
    getAddresses: () => userService.getAddresses(),
    uploadAvatar: (file) => userService.uploadAvatar(file),
    updateProfile: (data) => userService.updateProfile(data),
    changePassword: (data) => userService.changePassword(data),
    updateAddress: (id, data) => userService.updateAddress(id, data),
    addAddress: (data) => userService.addAddress(data),
    deleteAddress: (id) => userService.deleteAddress(id)
};
