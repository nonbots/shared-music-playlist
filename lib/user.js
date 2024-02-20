class User{
    constructor(first, last, password, userName, requestedSong, deletedSongs){
        this.first = first;
        this.last = last;
        this.password = password;
        this.userName = userName;
        this.id = this.getId();
        
        
    }
