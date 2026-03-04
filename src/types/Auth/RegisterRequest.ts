export type RegisterRequest = {
    inviteCode: string;
    email: string;
    password: string;
    fullName: string;
    birthDate: string;
    sex: "male" | "female" | "other" | "unknown";
};
