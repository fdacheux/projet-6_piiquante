const toSauce = (sauce, imageUrl, userId) =>{
    if (userId){
        const newSauce = JSON.parse(sauce);
        delete newSauce._id;
        delete newSauce._userId;
        return { 
            ...newSauce,
            userId : userId,
            imageUrl : imageUrl
          }
    }
    else if(imageUrl){
        return { 
            ...JSON.parse(sauce),
            imageUrl
          }
    } 

    return sauce
}

module.exports = toSauce;