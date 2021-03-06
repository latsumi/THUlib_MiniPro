const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

module.exports = async ctx => {
	const {mysql} = require('../qcloud')
	const DB = require('knex')({
		client: 'mysql',
		connection: {
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.pass,
			database: config.db,
			charset: config.char,
			multipleStatements: true
		}
	})
	const query = ctx.request.body
	let name_table = "manHourTable_" + query.library + "_" + query.begin + "_" + query.end
	await DB.schema.dropTableIfExists(name_table)
	await DB.schema.createTable(name_table,function(t){
		t.increments('id');
		t.string('name',30).notNullable();
		t.string('studentNum',100).notNullable();
		t.integer('library',11).notNullable();
		t.float('allManHour');
		t.float('commonManHour');
		t.integer('reliefTimes');
		t.float('leaderManHour');
		t.string('status',30).notNullable();
	})

	let begin = query.begin + " 00:00:00"
	let end = query.end + " 23:59:59"
	let res = await mysql('signin_fore').whereBetween('update_time', [begin, end]).where('library', query.library).select('*')
	let num = res.length
	var haveIt
	for( let i=0; i<num; i++){
		haveIt = await mysql(name_table).where({name: res[i].name, studentNum: res[i].studentNum, library: res[i].library})
		if(haveIt == 0){
			let status = await mysql('Address_List').where({ name: res[i].name, studentNum: res[i].studentNum }).select('status')
			await mysql(name_table).insert({ name: res[i].name, studentNum: res[i].studentNum, library: res[i].library, allManHour: res[i].manHour, commonManHour: res[i].manHour,  status: status[0].status })
			if(res[i].isLeader ==1){
				await mysql(name_table).where({ name: res[i].name, studentNum: res[i].studentNum, library: res[i].library}).update({allManHour: res[i].manHour + 0.5, leaderManHour: 0.5 })
			}
			if(res[i].isRelief == 1){
				await mysql(name_table).where({ name: res[i].name, studentNum: res[i].studentNum, library: res[i].library }).update({ reliefTimes: 1 })
			}
		}else{
			let last = await mysql(name_table).where({name: res[i].name, studentNum: res[i].studentNum, library: res[i].library}).select('allManHour','commonManHour','leaderManHour','reliefTimes')
			await mysql(name_table).where({ name: res[i].name, studentNum: res[i].studentNum, library: res[i].library }).update({ allManHour: last[0].allManHour + res[i].manHour,commonManHour: last[0].commonManHour + res[i].manHour})
			if (res[i].isLeader == 1) {
				await mysql(name_table).where({ name: res[i].name, studentNum: res[i].studentNum, library: res[i].library }).update({ allManHour: last[0].allManHour + res[i].manHour + 0.5, leaderManHour: 0.5+last[0].leaderManHour })
			}
			if (res[i].isRelief == 1) {
				await mysql(name_table).where({ name: res[i].name, studentNum: res[i].studentNum, library: res[i].library }).update({ reliefTimes: 1+last[0].reliefTimes })
			}
		}
	}
	ctx.state.data = name_table
}