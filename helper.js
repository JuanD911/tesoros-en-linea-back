// Clase de ayuda utilizada para ser usada en otros lados del Backend..

// Arreglo donde se guardaran los usuarios..
const users = [];

/* 
    Está función nos permite agregar un Usuario a una Sala
    se revisa si el usuario YA EXISTE en sala, si es así, generá un error, de lo 
    contrario el usuario es añadido al Arreglo.
*/
const addUser = ({ socket_id, name, user_id, room_id }) => {
    const exist = users.find(user => user.room_id === room_id && user.user_id === user_id);
    if (exist) {
        return { error: 'El usuario ya está en la sala.' }
    }
    const user = { socket_id, name, user_id, room_id };
    users.push(user)
    console.log('Usuarios', users)
    return { user }
}

/*
    Está función nos ayuda a remover un Usuario...git
*/
const removeUser = (socket_id)=>{
    const index = users.findIndex(user=>user.socket_id === socket_id);
    if(index !==-1){
        return users.splice(index, 1)[0]
    }
}

/*
    Está función nos permite obtener un usuario a partir del socket_id.
*/
const getUser = (socket_id) => users.find(user => user.socket_id === socket_id)

module.exports = {addUser, removeUser, getUser}