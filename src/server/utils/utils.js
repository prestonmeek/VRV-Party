module.exports = {
    functionFormat: (name) => {
        let res = name.split(' ');
    
        for (let i in res) {
            res[i] = res[i].charAt(0).toUpperCase() + res[i].slice(1);
        }
        
        return 'handle' + res.join('');
    }
}