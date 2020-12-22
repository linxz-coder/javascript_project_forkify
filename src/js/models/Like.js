export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();


        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        // [2,4,8] splice(1,1) -> returns [4], original array is [2,8];
        // [2,4,8] splice(1,2) -> returns [4,8], original array is [2];
        // [2,4,8] slice(1,1) -> returns 4, original array is [2,4,8];
        // [2,4,8] slice(1,2) -> returns 4, original array is [2,4,8];
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();


    }

    isLiked(id){
        // return true or false
        return this.likes.findIndex(el => el.id === id)!== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    // It will never disappear when you reload the page
    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
        console.log(localStorage);
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if(storage) this.likes = storage;

    }

}