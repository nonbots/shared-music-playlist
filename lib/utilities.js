class Utilities {
    static incrementId() {
        Song.id += 1;
    }
    static  getId() {
        this.incrementId();
        return Song.id;
    }

}
