let filelist = [];

let header = document.getElementById('header');
let url = window.location.href.split('?');
let o = {};
if (url[1]) {
	let params = url[1].split('&');
	params.forEach(item => {
		o[item.split('=')[0]] = decodeURI(item.split('=')[1], 'utf-8');
	})
	header.innerText = o.filename;
	document.addEventListener('plusready', async function() {
		let fileList = [];
		await getFileListFromAPI();
	});
}

function getDirectories(path) {
	return new Promise(function(resolve, reject) {
		plus.io.resolveLocalFileSystemURL(path, function(fs) {
				let directoryReader = fs.createReader();
				directoryReader.readEntries(function(entries) {
					resolve(entries);
				});
			},
			function(e) {
				reject(e.message);
			});
	})
}

function getDirectoriesDetail(diretory) {
	return new Promise(function(resolve, reject) {
		if (diretory.isFile) {
			diretory.file(function(file) {
				resolve({
					isFile: true,
					name: file.name,
					time: format(file.lastModifiedDate),
					path: o.path
				})
			})
		} else if (diretory.isDirectory) {
			diretory.getMetadata(function(dic) {
				resolve({
					isFile: false,
					name: diretory.name,
					time: format(dic.modificationTime),
					path: diretory.__PURL__
				})
			})
		}
	})
}
function getFileListFromAPI2() {
	let filefolderList = [];
	let token = localStorage.getItem('token');
	let xhr = new XMLHttpRequest();
	console.log(o.path);
	xhr.open('GET', 'https://pan.baidu.com/rest/2.0/xpan/multimedia?method=listall&access_token=' + token + '&path=' + o.path,true);
	// xhr.open('GET', 'https://pan.baidu.com/rest/2.0/xpan/file?access_token=' + token + '&method=list&dir=' + o.path,true);
	xhr.send();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4&&(xhr.status === 200 || xhr.status === 304)) {
			//解构赋值
			let {list} = JSON.parse(xhr.responseText);
			//添加文件名称，修改时间，路径
			for (let i in list) {
				let time = format(list[i].local_ctime);
				filefolderList.push({
					name: list[i].server_filename,
					time: time,
					isFile: !list[i].isdir,
					path: list[i].path
				})
			}
			renderFileList(filefolderList);
		}
	}
}
function getFileListFromAPI() {
	let filefolderList = [];
	let token = localStorage.getItem('token');
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://pan.baidu.com/rest/2.0/xpan/file?access_token=' + token + '&method=list&dir=' + o.path,true);
	xhr.send();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4&&(xhr.status === 200 || xhr.status === 304)) {
			//解构赋值
			let {list} = JSON.parse(xhr.responseText);
			//添加文件名称，修改时间，路径
			for (let i in list) {
				let time = format(list[i].local_ctime);
				filefolderList.push({
					name: list[i].server_filename,
					time: time,
					isFile: !list[i].isdir,
					path: list[i].path
				})
			}
			renderFileList(filefolderList);
		}
	}
}

function renderFileList(file) {
	let filelist = document.getElementById('filelist');
	for (let i = 0; i < file.length; i++) {
		let div = document.createElement('div');
		div.setAttribute('class', 'fileitem');
		let img = document.createElement('img');
		if (file[i].isFile) {
			img.src = 'img/file.png';
		} else {
			img.src = "img/ic_gc_main_empty_folder.png";
		}
		div.appendChild(img);
		let innerdiv = document.createElement('div');
		let innerdiv1 = document.createElement('div');
		innerdiv1.setAttribute('class', 'filename');
		innerdiv1.setAttribute('path', file[i].path);
		innerdiv1.innerText = file[i].name;
		innerdiv.appendChild(innerdiv1);
		let innerdiv2 = document.createElement('div');
		innerdiv2.setAttribute('class', 'date');
		innerdiv2.innerText = file[i].time;
		innerdiv.appendChild(innerdiv2);
		div.appendChild(innerdiv);
		div.addEventListener('click', function() {
			goToFilelist(this)
		}, false);
		filelist.appendChild(div);
	}
	div = document.createElement('div');
	div.style.width = '100%';
	div.style.height = '180px';
	filelist.appendChild(div);
}

function add0(m) {
	return m < 10 ? '0' + m : m;
}

function format(t) { //时间处理函数,将时间戳转化为想要的时间格式
	if (typeof(t) == 'number') {
		t = new Date(t * 1000);
	}
	let y = t.getFullYear();
	let M = t.getMonth() + 1;
	let d = t.getDay();
	let h = t.getHours();
	let m = t.getMinutes();
	return y + '-' + add0(M) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(m);
}

function goToFilelist(e) {
	let isFile = e.querySelector('img').src.indexOf('file.png') > 0;
	let filename = e.getElementsByClassName('filename')[0];
	let path = filename.getAttribute('path');
	if (isFile) {
		// var token=localStorage.getItem('token');
		// var xhr =new XMLHttpRequest();
		// xhr.onreadystatechange = function() {
		// 				if (xhr.readyState == 4 && (xhr.status == 200)) {
		// 					let res = JSON.parse(xhr1.responseText);
		// 					console.log(res.errno);
							
		// 				}
		// 			}
		// xhr.open('GET','https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&access_token=' + token+'&path='+path+'&fsids=[111,222]');
		// xhr.send();
		console.log(path + '/' + filename.innerText);
		plus.runtime.openFile(path + '/' + filename.innerText, {}, function(e) {
			plus.nativeUI.alert("无法打开此文件：" + e.message);
		})
	} 
	else {
		
		window.location.href = "filelist.html?filename=" + filename.innerText + '&path=' + path;
	}

}

function changeTab() {
	window.location.href = "home.html";
}

function goBack() {
	let path = o.path.split('/');
	if (path.length < 3) {
		window.location.href = 'filefolder.html';
	} else {
		path.pop();
		window.location.href = 'filelist.html?filename=' + path[path.length - 1] + '&path=' + path.join('/');
	}
}
