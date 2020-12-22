import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try{
        // fetch is not supported in all browser, so we use 'axios' here
        // axios automatically return json format
        const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
        this.result = res.data.recipes;
        // console.log(this.result);
        } catch(error) {
            alert(error);
        }
    
    
    }

}