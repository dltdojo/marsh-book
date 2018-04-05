import * as fs from 'fs';
export class Utils {
    public static loadKey(filename: string) {
        return fs.readFileSync(filename);
    }

    public static loadJwtPublicKey() {
        const publicPem = process.env.JWT_ES256_PEM_PUBLIC || 'es256-public-testonly.pem';
        return Utils.loadKey(publicPem);
    }
    
    public static loadJwtPrivateKey() {
        const privatePem = process.env.JWT_ES256_PEM_PRIVATE || 'es256-private-testonly.pem';
        return Utils.loadKey(privatePem);
    }
}