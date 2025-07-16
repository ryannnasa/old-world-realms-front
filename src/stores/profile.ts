import { defineStore } from 'pinia';

export type Profile = {
    email: string;
    emailVerified: boolean;
    firstName: string;
    id: string;
    lastName: string;
    username: string;
};

export const useProfileStore = defineStore('profile', {
    state: () => ({ profile: null as Profile | null }),
        actions: {
        getProfile(profile : Profile) {
            this.profile = profile;
        }
    }
});
