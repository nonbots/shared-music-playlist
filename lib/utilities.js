class Utilities {
    static incrementId(entity) {
        entity.id += 1;
    }
    static  getId(entity) {
        Utilities.incrementId(entity);
        return entity.id;
    }

}
module.exports = Utilities;
