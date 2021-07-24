const express = require('express');
const app = express();
const mysql = require('mysql');
const axios = require('axios');
//for hashing password
const crypto = require('crypto');
const hashkey="safnamkrinea567";
app.use(express.json());
////
var cors = require('cors')
app.use(cors()) // Use this after the variable declaration
////
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//
const db = mysql.createPool({
    host:'remotemysql.com',
    user:'ydTQLJ2QTo',
    password:'50LyPmyy7z',
    database:'ydTQLJ2QTo',
    port:3306
})
app.get('/',(req,res)=>{
    
    
    res.send('hello worl');
    //});
})
app.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = (crypto.createHmac('sha256',hashkey).update(req.body.password).digest('hex')).substring(0,24);
    //let password = (CryptoJS.AES.encrypt(req.body.password, 'safnamkrish').toString()).substring(0,24);
    console.log(password)
    const query = "select user_id from login l,user u where(l.email=(?) and password=(?) and l.email=u.email)";
    db.query(query,[email,password],(err,result)=>{
        try{
            if(err==null)
            {
                res.status=200
                res.send({"msg":"success","user_id":result[0]["user_id"]});
                
            
            }
            else
            {
                throw err
            }
        }
        catch(e)
        {
            console.log("wrong")
        }

        
    })
})

app.get('/getReactions/:id',(req,res)=>{
    const post_id = req.params.id
    const query = "select * from post_reaction where post_id = (?) "
    db.query(query,[post_id],(err,result)=>{
        if(err===null)
        {
            res.send({"msg":"successful","reactions":result})
        }
    })
})

app.post('/signup',(req,res)=>{
    const email = req.body.email
    let flag = true
    //const password = req.body.password
    const password = (crypto.createHmac('sha256',hashkey).update(req.body.password).digest('hex')).substring(0,24);
   // let password = (CryptoJS.AES.encrypt(req.body.password, 'safnamkrish').toString()).substring(0,24);
    console.log(password)
    const name = req.body.name
    const branch = req.body.branch
    const grad_year = req.body.grad_year
    const query = "select * from login where email=(?)"
    const query1 = "insert into login values (?,?);"
    const query2 = "insert into user(name,email,branch,grad_year) values (?,?,?,?);"
    const query3 = "select user_id from login l,user u where(l.email=(?) and password=(?) and l.email=u.email)";
    db.query(query,[email],(err,result)=>{
        if(result.length>0)
        {
            res.send({"msg":"uses already exists!"});
            
        }
        else
        {
            db.query(query1,[email,password], (err,result)=>{ 
                if(err!=null)
                {
                    console.log(err)
                    res.send({"msg":"failed"});
                    flag = false
                    
                }
                else
                {
                    db.query(query2,[name,email,branch,grad_year],(err,result)=>{
                        if(err!=null)
                        {
                            flag=false
                            
                            console.log(err);
                            res.send({"msg":"failed"});
                            
                            const query = "delete from login where email like (?)";
                            db.query(query,[email]);
                        }
                        else
                        {
                            db.query(query3,[email,password],(err,result)=>{
                                if(err==null)
                                {
                                    res.status=200
                        
                                    
                                    res.send({"msg":"success","user_id":result[0]["user_id"]});
                                }
                                else
                                {
                                    console.log('select error')
                                    res.send({"msg":"failed"});
                                }
                                
                            })
                        }
                    })
                }
            })
        }
    });

 

})
/*
app.post('./uploadPost',(req,res)=>{
    
})
*/

app.get('/getUser/:id',(req,res)=>{
    const id = req.params.id;
    var query1 = 'select name from user where user_id = (?)'; 
    db.query(query1,[id],(err,result)=>{
        if(err==null&&result.length!=0)
        {
            res.send(result[0]);
        }
        else
        {
            res.send({"msg":"error"});
        }

    })

})

app.post('/addLike',(req,res)=>{
    const user_id = req.body.user_id
    const post_id = req.body.post_id
    const upvote = 1
    const query = 'insert into post_reaction(post_id,user_id,upvote) values(?,?,?)'
    db.query(query,[post_id,user_id,upvote],(err,result)=>{
        if(err===null)
        {
            res.send({"msg":"successful"})
        }
        else
        {
            res.send({"msg":"failed"})
        }
    })
})

app.post('/removeLike',(req,res)=>{
    const user_id = req.body.user_id
    const post_id = req.body.post_id
    const upvote = 1
    const query = 'delete from post_reaction where user_id = (?) and post_id=(?) and upvote = (?)'
    db.query(query,[user_id,post_id,upvote],(err,result)=>{
        if(err===null)
        {
            res.send({"msg":"successful"})
        }
        else
        {
            console.log(err)
            res.send({"msg":"failed"})
        }
    })
})


app.get('/getPosts/:branch',(req,res)=>{
    let i=0;
    var query = 'select * from post order by date_time desc';
    if(req.params.branch!='ALL')
    {
        query='select * from post where user_id in (select user_id from user where branch=\''+req.params.branch+'\') order by date_time desc';
    }
    let posts=[];
    db.query(query,[],async (err,result)=>{
        if(err===null)
        {
            
        //   await result.map(element => {
        //         var query1 = 'select name from user where user_id = (?)'; 
        //        db.query(query1,[element["user_id"]],(err1,result1)=>{
                    
        //             element["name"]=result1[0]["name"];
                    
        //             posts.push(element);
        //             console.log(posts)
        //             return element;
        //                     //result[i]["name"]=(result1[0]["name"]);
        //             })
        //     });
            for(i of result)
            {
               await axios.get('https://placementexperience-api.herokuapp.com/getUser/'+i["user_id"])
                .then(response => {
                             i["name"]=response.data["name"];
                             posts.push(i);
                             console.log(response.data)
                             })
                    .catch(error => {
                      console.log(error);
                  });
            }
            console.log(posts);
            // for(i=0;i<result.length;i++)
            // {
            //     var query1 = 'select name from user where user_id = (?)'; 
            //     db.query(query1,[result[i]["user_id"]],(err1,result1)=>{
            //     console.log(result[i]);
            //             //result[i]["name"]=(result1[0]["name"]);
                    
            //     })
            // }
            res.status=200;
            res.header
            res.send({posts});
        
        }
        else
        {
            res.send({"msg":"failed"});
        }
        
    })
})

app.get("/checkEmail/:email",(req,res)=>{
    const email = req.params.email
    const query = 'select email from login where email = (?)'
    db.query(query,[email],(err,result)=>{
        if(err==null)
        {
            if(result.length>0)
            res.send({"msg":"exists"})
            else
            res.send({"msg":"does not exist"})
        }
        else
        {
            console.log(err)
            res.send({"msg":"error"})
        }
    })
})

/********************************************************************/
/********************************************************************/
//POST: 
app.post("/uploadPost", (req, res) => {
	let data = { company: req.body.company, image_content: req.body.image_content,text_content:req.body.text_content,user_id:req.body.user_id,date_time:req.body.date_time};
	let sql = "INSERT INTO post SET ?";
	let query = db.query(sql, data, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "Post added successfully" }));
	});
});

//ASK QUESTION:
app.post("/ask-submit",(req,res)=>{
    let data={question:req.body.question,user_id:req.body.user_id};
    let sql="INSERT INTO question SET ?";
    let query=db.query(sql,data,(err,result)=>{
        if(err) throw err;
        res.send(JSON.stringify({status:200,error:null,response:"Question added successfully"}));
    })
})
//Get Questions:
app.get("/get-questions",(req,res)=>{
    let sql="Select * from question order by question_id desc";
    let questions=[]
    db.query(sql,async (err,result)=>{
        if(err==null)
        {

            for(i of result)
            {
                questions.push(i);

            }
            //console.log(posts);
            res.status=200;
            res.header
            res.send({questions});
        
        }
        else
        {
            res.send({"msg":"failed"});
        }
    })
})
//Get Single Question:

app.get("/getSingleQuestion/:id",(req,res)=>{
    let sql="Select question.question from question where question_id="+req.params.id;
     let questions=[]
    db.query(sql,async (err,result)=>{
        if(err==null)
        {
            for(i of result)
            {
                questions.push(i);
            }
            console.log(questions);
            res.status=200;
            res.header
            res.send(result);
        
        }
        else
        {
            res.send({"msg":"failed"});
        }
    })
})
//ANSWER:
app.post("/answerSubmit",(req,res)=>{
    let data={answer:req.body.answer,question_id:req.body.question_id,user_id:req.body.user_id};
    let sql="INSERT INTO answer SET ?";
    let query=db.query(sql,data,(err,result)=>{
        if(err!=null) throw err;
        res.send(JSON.stringify({status:200,error:null,response:"Answer added successfully"}));
    })
})

//Getting user post in profile:

app.get('/getUserPosts/:id',(req,res)=>{
    let i=0;
    const query = 'select * from post where user_id='+req.params.id;
    let posts=[];
    db.query(query,async (err,result)=>{
        if(err==null)
        {

            for(i of result)
            {
                posts.push(i);

            }
            console.log(posts);
            res.status=200;
            res.header
            res.send({posts});
        
        }
        else
        {
            res.send({"msg":"failed"});
        }
        
    })
})

//getting profile data
app.get('/profile/:id',(req,res)=>{
    const query="select * from user where user_id="+req.params.id;

    db.query(query,async(err,result)=>{
        if(err==null)
        {
            res.status=200;
            res.header
            res.send(result)
        }
        else
        {
            res.send({"msg":"failed"})
        }
    })
})
//____________________________________________
//EDIT PROFILE:
//NOTE : CANT UPDATE EMAIL HERE AS IT IS FOREIGN KEY OF USER=>FIX 
app.post('/profile-edit/:id',(req,res)=>{
    const sql='Update user set name=\"'+req.body.name+"\",grad_year=\""+req.body.grad_year+"\",user.description=\""+req.body.description+"\",company=\""+req.body.company+"\",branch=\""+req.body.branch+"\" where user_id="+req.params.id;
    console.log(sql)
    let query=db.query(sql,(err,result)=>{
        if(err) throw err;
        else
        res.send(JSON.stringify({status:200,error:null,response:"Profile updated successfully"}));
    })
})
//_____________________________________________
//DELETE POST:

app.delete('/delete-post/:id',(req,res)=>{
    const sql="delete from post where post_id="+req.params.id;
    let query=db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(JSON.stringify({status:200,error:null,response:"Post deleted successfully"}));
    })
})

///Getting answers of a question

app.get('/getAnswers/:id',(req,res)=>{
    let i=0;
    const query = 'select * from answer where question_id='+req.params.id+' order by answer_id desc;';
    let posts=[];
    db.query(query,async (err,result)=>{
        if(err==null)
        {

            for(i of result)
            {
                posts.push(i);

            }
            console.log(posts);
            res.status=200;
            res.header
            res.send({posts});
        
        }
        else
        {
            res.send({"msg":"failed"});
            throw err;
            
        }
        
    })
})




















// app.listen(3001,(err) =>{
//     console.log('Server started at port 3001')
// });
// app.listen(process.env.PORT,(err)=>{
//     console.log('Server started')
// })
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});