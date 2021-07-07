class User {
    constructor(id, username, passwordHash, address, phoneCountryCode, phoneNumber) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.address = address;
        this.phoneCountryCode = phoneCountryCode;
        this.phoneNumber = phoneNumber;
    }

    clean() {
        var cleanedObject = this;
        cleanedObject.id = null;
        cleanedObject.passwordHash = null;
        return cleanedObject;
    }
}