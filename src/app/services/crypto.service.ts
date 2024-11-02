import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    private readonly saltRounds = 10;
    private readonly secretKey = 'your-secret-key'; // Remplacez par une clé secrète sécurisée

    constructor() {}

    // Hachage unidirectionnel avec bcrypt
    async hashData(data: string): Promise<string> {
        try {
            return await bcrypt.hash(data, this.saltRounds);
        } catch (error) {
            console.error('Error hashing data:', error);
            throw error;
        }
    }

    // Comparaison de données avec un hash bcrypt
    async verifyHash(data: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(data, hash);
        } catch (error) {
            console.error('Error comparing data:', error);
            throw error;
        }
    }

    // Chiffrement AES pour des données réversibles (par ex. date et heure)
    encrypt(data: string): string {
        return CryptoJS.AES.encrypt(data, this.secretKey).toString();
    }

    // Déchiffrement AES pour des données réversibles
    decrypt(encryptedData: string): string {
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}
