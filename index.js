const express = require("express");
const path = require('path');



const todos = [{id:1, name:'Wake up at 9 AM'},
               {id:2, name: 'Drink a coffie'}];
let lastId = 0;
todos.forEach((todo)=>{ // or just taked from DB
    if(todo.id > lastId){
        lastId = todo.id;
    }
}); 
const app = express();
app.use(
    express.urlencoded({
      extended: true,
    })
);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'styles'))); 

app.set('view engine', 'pug')

app.get('/', (req, res) => { 
    res.render('index', {pageTitle: 'ToDo App', todos:todos});
})

app.post('/create' , (req, res, next) => {
    let todoName = req.body.todoName.trim();
    if(!todoName){
       next({status: 400, msg: "Todo can\'t be empty"});
    } else {
        const todo = {
            id: ++lastId,
            name: todoName
        }
        todos.push(todo);
        res.redirect(303, '/'); 
    }
    
}) 
 
app.delete("/delete/:id", (req, res, next) => {
    const todoIndex = todos.findIndex((item) => item.id == req.params.id);
    if (todoIndex == -1) { 
        next({ status: 404, message: "Item not found." });
    } else {
        todos.splice(todoIndex, 1);
        res.status(204);
    }

});
app.get("/edit/:id", (req, res, next) =>{
    const todoIndex = todos.findIndex((item) => item.id == req.params.id);
    if(todoIndex == -1) {
        next({ status: 404, msg: "ToDo not found" });
    } else {
        let todo = todos[todoIndex];
        res.render('edit', todo); 
    }
    
})

app.post("/edit/:id", (req, res, next) => {
    const todoIndex = todos.findIndex((item) => item.id == req.params.id);
    if (todoIndex == -1) {
        next({ status: 404, msg: "ToDo not found" });
    } else if (!req.body.name) {
        next({ status: 400, msg: "Invalid data" });
    } else {
        todos[todoIndex].name = req.body.name;
        res.status(200).redirect("/"); 
    }
});

app.use((err, req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(`<span>${err.status} , ${err.msg}</span> <br> <a href="/"> back to home</a>`);
});   

app.listen(5000, ()=> console.log('Server is running'));
