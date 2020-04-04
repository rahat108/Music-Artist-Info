const express = require('express');
const app = express();
app.set('view engine','ejs');
var url = require('url');
var path = require('path');
const mongoose = require('mongoose');
var session = require('express-session');
const bodyParser = require('body-parser');
const { check} = require('express-validator');
app.use(session({secret:'XASDASDA'}));
var ssn;
//mongodb connect replaced the actual password with <PASSWORD> for security reasons, if password needed mail me at - rahatgupta108@gmail.com
mongoose.connect("mongodb+srv://rahat:<PASSWORD>@cluster0-q9dsy.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var dir = path.join(__dirname, 'screenshots');
app.use(express.static(dir));

// mongoose Database Schema
const artistsSchema = new mongoose.Schema({     //artists collection
	name:String,
	dob:String,
	bio:String
});


const songsSchema = new mongoose.Schema({   //songs collection
	songname:String,
	dor:String,
	cover: String
});

const usersSchema = new mongoose.Schema({   //users collection
	name:String,
	email:String,
	artistsid: [{type: String}],
	songsid:[{type: String}],
	ratings:[{type: Number}]
});

const artist_songSchema = new mongoose.Schema({  //artist_song collection
	artid: mongoose.ObjectId,
	songid: mongoose.ObjectId 
});


const ratingSchema = new mongoose.Schema({  //rating collection
	userid:mongoose.ObjectId,
	songid:mongoose.ObjectId,
	rating:Number
});

const user = mongoose.model("users",usersSchema);   //declaration
const artist = mongoose.model("artists",artistsSchema);
const song = mongoose.model("songs",songsSchema);
const art_song = mongoose.model("artist_songs",artist_songSchema);
const rate = mongoose.model("rating",ratingSchema);

//-------------------------------------------------------------------------------------//
//--------------------First screen (Homepage)------------------------------------------//

app.get("/",function(req,rest) //first page rendering all the data on the tables
{
	var dict = []; 
	var che = [];
	var tik = [];
	var tok = [];
	var rat = [];
	var done = 0;

	user.find({},{artistsid:1,_id:0,songsid:1,ratings:1},function(err,doc){
		for(var i=0;i<doc.length;i++)
		{
			if(doc[i]['artistsid'][1]!=undefined)
		  		continue;
		  	var songs=[]
		  	songs.push(doc[i]['songsid'])
		  	for(var j=i+1;j<doc.length;j++)
		  	{
          		if(doc[i]['artistsid'][0]==doc[j]['artistsid'][0])
            	{
               		songs.push(doc[j]['songsid']);
            	}
		  	}
		  	dict.push({
    		key:  doc[i]['artistsid'][0],           
    		value: songs
			});
			rat.push(doc[i]['ratings'][0]);
		}
	}).then((result)=>{
		var c=[];
		var r=[];
   		for(var i=0;i<dict.length;i++)
   		{
   			var nam=dict[i].key;
   			var xyz=dict[i].value;
			tik.push(xyz[0].toString().split(",")[0]);
			song.find({songname:tik[i].toString()},{_id:0,cover:1,dor:1},function(errorz,docz){
			// console.log(docz[0]);
				c.push(docz[0]['cover']);
				r.push(docz[0]['dor']);
			})
     		artist.find({name:nam},function(errors,docs){
				che.push(docs[0]['dob']);
			}).then((res2)=>{
                if(che.length==dict.length && done==0)
                {
               		rest.render('index',{data:dict,peda:che,iloc:c,ral:r,beep:rat});  //rendering on homescreen
               		done=1;
                }
            });
    	}
	})
});

//-----------------------------------Second Page---------------------------//

app.post("/song.ejs",function(req,res){  //add new song and artist 
 
	const Artist = new artist ({   // save artist in modal
		name:req.body.aname,
		dob:req.body.dob,
		bio:req.body.bio
	});
	Artist.save();
 
	var a = new song;   //save song
	a.songname= req.body.song_name;
	a.dor= req.body.dor;
    a.cover=req.body.cover;
    var cur_song=req.body.song_name;
    a.save().then((result)=>{
    	var tot_art=req.body.artists_name; //update artistid and songid
   
    	if (typeof tot_art === 'string')  //for single artist 
    	{
    		user.findOne({artistsid:ssn.naam},function(err,doc){
    			doc['artistsid'].push(tot_art);
    			doc['songsid'].push(cur_song);
    			doc['ratings'].push(3);
    			user.updateOne({name:ssn.naam}, { artistsid: doc['artistsid'],songsid:doc['songsid'],ratings:doc['ratings'] },function(errors,docs){
    			// console.log(docs);
    			});
    		}) 	
    	}
    	else    //for multiple artists
    	{
    		user.findOne({name:ssn.naam},{artistsid:1,songsid:1,_id:0,ratings:1},function(err,doc){
    			doc['artistsid'].push(tot_art.toString());
    			doc['songsid'].push(cur_song);
    			doc['ratings'].push(3);
    			user.updateOne({name:ssn.naam}, { artistsid: doc['artistsid'],songsid:doc['songsid'],ratings:doc['ratings'] },function(errors,docs){
    			// console.log(docs);
    			});
    		}) 	
    	}
		res.redirect('/song.ejs');
	})
});



app.get("/song.ejs",function(req,res){    //displaying the artist in select menu on second screen
	artist.find({},{name:1,_id:0,dob:1}, function(err, doc) {
  		var x=[];
  		for (var i in doc)
  		{
  			x[i]=doc[i]['name'];
  		}
    	res.render("song",{art_name:x}); 
	})
})


app.get('/:name', function(req, res) {     // checking if user is valid 
    const id = req.params.name;            // by directly enter the name in the url
    ssn=req.session;                       // localhost:300/username
    if (id=='song.ejs')
    {
      	res.render("song");
    }
    else
    {
	    user.findOne({ name: id }, function(err, doc) {
	        if(doc) 
	        {
	          	ssn.naam=id;
	           	console.log(ssn.naam);
	            res.redirect('/');
	        } 
	        else 
	        {
	            res.send("user not found");
	        }
	    });
	}
});

app.listen(3000, function(){     			// port is set to 3000
	console.log("started at 3000");
});
