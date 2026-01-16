import 'express';

declare global {
    namespace Express {
        interface User {
            id: number;
            isAdmin: boolean;
        }

        interface Request {
            user: User;
        }
    }
}
