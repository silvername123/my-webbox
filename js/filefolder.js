var fs_id=[];
window.onload = () => {
	
		const url = window.location.href;
		let key;
		if (url.indexOf('?') > -1) {
		key = decodeURI(url.split('?')[1].split('=')[1]);
		document.querySelector('.search>input').value = key;
		}
		document.addEventListener('plusready', async function() {
		let fileList = [];
		await getFileListFromAPI();
		});
		for (var i in fs_id)
		console.log('fs_id'+fs_id[i]);
		
	
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
					path: '_www'
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

function getFileListFromAPI() {
	let filefolderList = [];
	//读取本地token
	let token = localStorage.getItem('token');
	let xhr = new XMLHttpRequest();
	console.log(window.location.href);
	if (window.location.href.indexOf('?') > 0) {
		let key = decodeURI(window.location.href.split('?')[1].split('=')[1], 'utf-8');
		console.log(key);
		//发送请求
		xhr.open('GET', 'https://pan.baidu.com/rest/2.0/xpan/file?method=search&access_token=' + token + '&key=' + key, true);
		xhr.send();
		
		
		//观察状态
		xhr.onreadystatechange = function() {
			//读取文件，判断属性
			if (xhr.readyState == 4 && (xhr.status === 200 || xhr.status === 304)) {
				const {
					list
				} = JSON.parse(xhr.responseText);
				for (let i in list) {
					fs_id=list[i].fs_id;
					let time = format(list[i].local_ctime);
					filefolderList.push({
						fs_id:list[i].fs_id,
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
	else {
		xhr.onreadystatechange = async function() {
			if (xhr.readyState == 4 && (xhr.status === 200 || xhr.status === 304)) {
				let {
					list
				} = JSON.parse(xhr.responseText);
				for (let i in list) {
					// console.log(list[i].server_filename);
					let time = format(list[i].local_ctime);
					
					// console.log(fs_id);
					filefolderList.push({
						fs_id:list[i].fs_id,
						name: list[i].server_filename,
						time: time,
						isFile: !list[i].isdir,
						path: list[i].path
					})
				}
				renderFileList(filefolderList);
			}
		}
		xhr.open('GET', 'https://pan.baidu.com/rest/2.0/xpan/file?access_token=' + token + '&method=list', true);
		xhr.send();
	}
}

async function searchFileList(key, diretory) {
	let entries = await getDirectories(diretory.__PURL__);
	let fileList = [];
	for (let i = 0; i < entries.length; i++) {
		if (entries[i].name.indexOf(key) > -1) {
			let file = await getDirectoriesDetail(entries[i]);
			fileList.push(file);
		}
		if (entries[i].isDirectory) {
			let f = await searchFileList(key, entries[i]);
			fileList = fileList.concat(f);
		}
	}
	return fileList;
}

function renderFileList(file) {
	let filefolder = document.getElementById('filefolder');
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
			goToFilelist(this,i,file);
			console.log(file[i].fs_id);
		}, false);
		filefolder.appendChild(div);
	}
	div = document.createElement('div');
	// div.style.width = '100%';
	// div.style.height = '180px';
	filefolder.appendChild(div);
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

function goToFilelist(e,i,file) {
	let isFile = e.querySelector('img').src.indexOf('file.png') > 0;
	let filename = e.getElementsByClassName('filename')[0];
	let path = filename.getAttribute('path');
	if (isFile) {
		let token=localStorage.getItem('token');
			var xhrt =new XMLHttpRequest();
			var xhrt1 =new XMLHttpRequest();
			xhrt.onreadystatechange=function(){
				if(xhrt.readyState == 4 && xhrt.status === 200){
					let res=JSON.parse(xhrt.responseText);
					console.log("1");

					const a = document.createElement('a'); // 创建a标签
					a.setAttribute('download','');
					a.setAttribute('onclick', 'reaturn false');// download属性
					a.setAttribute('href', res.list[0].dlink+'&access_token='+token);// href链接 
					a.click();// 自执行点击事件
					
				}
			}
			 xhrt.open('GET','https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&access_token='+token+'&fsids=['+file[i].fs_id+']&dlink=1');
			 xhrt.send();
		// 	plus.runtime.openFile(path + '/' + filename.innerText, {}, function(e) {
		// 	plus.nativeUI.alert('无法打开此文件：' + e.message);
		// })
	} else {
		console.log('111');
		window.location.href = "filelist.html?filename=" + filename.innerText + '&path=' + path;
	}

}

function changeTab() {
	window.location.href = "home.html";
}

function goToSearch() {
	window.location.href = "search.html";
}
