
export interface JwtPayload {
    user: {
        id: string;
        name: string;
        email: string;
    }
}