
function Chain(obj){
    this.obj = obj
}

Chain.prototype.then=function(...rest){
    let fn = rest[0],p = rest.splice(1)
    p.unshift(this.obj)
    this.obj = fn.apply(null,p)
    return this
}
Chain.prototype.end = function(){
    return this.obj
}


module.exports = Chain