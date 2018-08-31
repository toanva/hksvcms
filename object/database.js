/////Search engine functions create new, update, delete data in mongoDb
MongoClient = require('mongodb').MongoClient;
mongodb = require('mongodb');
config = require('config');

MONGO_URL = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('mongoUrl');
DATA_BASE_NAME = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('databasename');

var dbQueryCounter = 0;
var maxDbIdleTime = 5000; 
module.exports = {
	getConnection: function (callback) {

		MongoClient.connect(MONGO_URL, function (err, client) { //conn =client;
			//console.log("Create:",client);
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				//console.log("Create conn 2:");
				callback(client);
			}
		});

	},
	findMembersByGroup: function (pipeline, options, client, callback) {

		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Members');
		collection.aggregate(pipeline, options).toArray(function (err, results) {
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
    findMembers: function (query, client, callback) {
        // Get the documents collection
        const db = client.db(DATA_BASE_NAME);
        collection = db.collection('Members');
        // Find some documents
        collection.find(query).sort({
            "_id": 1
        }).toArray(function (err, results) {
            //    assert.equal(err, null);
            if (err) {
                console.log("err:", err);
                callback(err);
            } else {
                callback(results);
            }
        });
    },
	findKycMembers: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('KycMembers');
		// Find some documents
		collection.find(query).sort({
			"Provincial": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	insertMembers: function (objMember, client, callback) {
		var mydate = new Date();
		var inputDate = new Date(mydate.toISOString());
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
	    const collection = db.collection('Members');
		//var objCallback = null;
		collection.find({
			'_id': objMember._id
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				//callback(err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length == 0) {
					// insert documents
					collection.insertOne(objMember, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						callback(null, res);
					});

				} else {
					//console.log('Thành viên đã điểm danh');
					var objMemberUpdate = {
						$set: {
							"Name": objMember.Name,
							"Birthday": objMember.Birthday,
                            "Address": objMember.Address,
                            "CMT": objMember.CMT,
							"Phone": objMember.Phone,
							"UpdateDate": inputDate
						}
					};
					collection.updateOne({
						'_id': objMember._id
					}, objMemberUpdate, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						console.log("Update:", objMemberUpdate);
						callback(null, res);
					});
					//callback(null, res);
				}
			}
		});
    },
    insertDocument: function (objDocument, client, callback) {
        // Get the documents collection
        const db = client.db(DATA_BASE_NAME);
        const collection = db.collection('Document');
        //var objCallback = null;
        console.log("objDocument :", objDocument);
        collection.insertOne(objDocument, function (err, res) {
            //neu xay ra loi
            if (err) throw err;
            //neu khong co loi			
            callback(null, res);
        });
    },
	insertLogs: function (objLogs, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('LogsMessage');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		collection.insertOne(objLogs, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	//Toanva process Users
	findUsers: function (query, client, callback) {
		// Get the Users collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		// Find some Users
		collection.find(query).sort({
			"_id": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	insertUsers: function (objUser, client, callback) {

		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		//var objCallback = null;
		collection.find({
			'UserName': objUser.UserName
		}).toArray(function (err, results) {
			if (err) {
				console.log("err:", err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length == 0) {
					console.log('Them tai khoan :', objUser.UserName);
					// insert Users
					collection.insertOne(objUser, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						console.log('Them thanh cong :', objUser.UserName);
						callback(null, 'SUCCESS');
					});

				} else {
					//đã tồn tại
					//console.log('Tai khoan da ton tai');
					callback('ERROR_EXIST');
				}
			}
		});
	},
	editUsers: function (objUser, client, callback) {
		// Get the Users collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		collection.find({
			'UserName': objUser.UserName
		}).toArray(function (err, results) {
			if (err) {
				console.log("err:", err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length > 0) {
					console.log('Update user:', objUser.UserName);
					// edit Users
					var objUserUpdate = {
						$set: {
							"UserName": objUser.UserName,
							"FullName": objUser.FullName,
							"Status": objUser.Status
						}
					};
					if (objUser.Password.length > 0) {
						objUserUpdate = {
							$set: {
								"Password": objUser.Password,
							}
						}
						console.log('Reset password');
					}
					collection.updateOne({
						'_id': results[0]._id
					}, objUserUpdate, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						console.log("Update success");
						callback(null, res);
					});
				} else {
					//đã tồn tại
					console.log('Update fail. User not found');
					callback('Tài khoản không tồn tại');
				}
			}
		});
	},
	deleteUser: function (UserName, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		var myquery = {
			UserName: UserName
		};
		collection.deleteOne(myquery, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			callback(null, res);
		});
	},
	// Toanva process User - End

}
