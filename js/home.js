			let token = localStorage.getItem('token');
			//退出登录
			function goout() {
				let xhr = new XMLHttpRequest();
				let token = localStorage.getItem('token');
				xhr.open('GET', 'https://openapi.baidu.com/rest/2.0/passport/auth/revokeAuthorization?access_token=' + token, true);
				xhr.send();
				window.location.href = "login.html";
			}
			window.onload = () => {
				// localStorage.clear();
				console.log(token);
				getUserInfo(token);
				// saveImage();
			}
			
			
			//获取个人信息
			function getUserInfo(token) {
				let avatar = document.getElementById('avatar');
				let username = document.getElementById('username');
				let xhr = new XMLHttpRequest(); //用于在后台与服务器交换数据
				let xhr1 = new XMLHttpRequest();
				var img = localStorage.getItem('avatar');
				var na = localStorage.getItem('username');
				var vo = localStorage.getItem('volumn');
				
				// console.log(xhr.readyState);
				// console.log(xhr.status);
				//获取昵称和头像
				
				if (xhr.readyState == 0 && xhr.status == 0) {					
					username.innerHTML = na;
					// avatar.src=img;
					// console.log(img);
				}
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200 ) {
						let res = JSON.parse(xhr.responseText);
						// avatar.src='img/file_add_btn_file.png';
						avatar.src = res.avatar_url;
						username.innerText = res.baidu_name;
						localStorage.setItem('username', res.baidu_name);
		 				
					}
				}
				xhr.open('GET', 'https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo&access_token=' + token, true);
				xhr.send();
				
				// console.log(xhr1.readyState);
				// console.log(xhr1.status);
				//获取网盘容量
				if(xhr1.readyState==0&&xhr1.status == 0){
					let volumn = document.getElementById('volumn');
					volumn.innerHTML=vo;
				}
				xhr1.onreadystatechange = function() {
					
					if (xhr1.readyState == 4 && (xhr1.status === 200 || xhr1.status === 304)) {
						let res = JSON.parse(xhr1.responseText);
						let total = res.total;
						let used = res.used;
						let volumn = document.getElementById('volumn');
						let process = document.getElementById('process');
						let x = parseInt(used / total * 100);
						process.style.width = x + '%';
						total = total / 1024 / 1024 / 1024;
						used = (used / 1024 / 1024 / 1024).toFixed(1);
						var temp = used + 'GB/' + total + 'GB'
						volumn.innerHTML = temp;
						localStorage.setItem('volumn', temp);
					}
				}
				xhr1.open('GET', 'https://pan.baidu.com/api/quota?access_token=' + token, true);
				xhr1.send();
			}

			function changeTab() { //tab切换通过页面跳转实现
				window.location.href = "filefolder.html"; //跳到time.html
			}
			function getname(){
				//弹出框
				var s=document.getElementById("filename");
				var tem=s.value.trim()
				console.log(tem);
				if(tem.length!=0){
					var path=tem;
					console.log('2');
					let xhr1 = new XMLHttpRequest();
					xhr1.onreadystatechange = function() {
						if (xhr1.readyState == 4 && (xhr1.status == 200)) {
							let res = JSON.parse(xhr1.responseText);
							console.log(res.errno);
							console.log(res.isdir);
							block_list=res.server_filename;
							console.log("bl:"+block_list);
						}
					}
					xhr1.open('POST', 'https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=' + token, true);
					var b='path=/'+path+'&size=33818&isdir=1&rtype=3&uploadid=N1-NjEuMTM1LjE2OS44NDoxNTQ1OTY5MjAzOjgzODQwOTkyMzc2Nzc3MTQwNjc=&block_list=["7d57c40c9fdb4e4a32d533bee1a4e409"]';
					xhr1.send(b);
					let popup=document.getElementsByClassName("popup");
					for(var i in popup){
						popup[i].style.display='none';
					}
					return tem;
				}
				else{
					console.log('1');
					return null;
				}
			}
			function createfile(){
				let popup=document.getElementsByClassName("popup");
					for(var i in popup){
					popup[i].style.display='block';
					}
				}
			function updatefile(){
				document.getElementById("btn_file").click(); 
				var btnFile = document.getElementById("btn_file");
				btnFile.onchange = function() {
					var file = this.files[0];
					for(var i in file)
					console.log(file[i]);
					    if(!!file){
					        var reader = new FileReader();
					        reader.readAsArrayBuffer(file);
							// console.log(this.result);
					        reader.onload = function(){
					            var binary = this.result;
					            upload(binary);
					    }
					}
				    // this.form.submit();
				}
			}
			function updatefil(){
				let file='file:///C:/Users/admin/Desktop/H54/img/file.png';
				var path='/apps/0';
				let xhr = new XMLHttpRequest(); 
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && (xhr.status == 200)) {
						let res = JSON.parse(xhr.responseText);
						// console.log(res.return_type);
						console.log(res.errno);
						// for(var i in res){
						//  console.log(res.uploadid[i]);
						// }
						// console.log(r)
						// console.log(uid);
						block_list=res.block_list;
						console.log("bl:"+res.block_list);
					}
				}
				xhr.open('POST', 'https://pan.baidu.com/rest/2.0/xpan/file?method=precreate&access_token=' + token, true);
				var a='path=/baidu/test/test.txt&size=2626327&isdir=0&autoinit=1&rtype=3&block_list=["60bac7b6464d84fed842955e6126826a"]&content-md5=60bac7b6464d84fed842955e6126826a&slice-md5=3c5c864d432cc2381b687f8d873e1429';
				xhr.send(a);
				var body=document.getElementById('nsp');
				var form=document.createElement("form");
				// form.method='post';
				// form.action='https://d.pcs.baidu.com/rest/2.0/pcs/superfile2?access_token=7gDtdAkctsK55gtlO3Sq0AsY&method=upload&type=tmpfile&path=/baidu/test/&uploadid=N1-NjEuMTM1LjE2OS44NDoxNTQ1OTY1NTQyOjgzODMxMTY0MDkyNDY2NjQ5Nzg&partseq=0';
				form.enctype='multipart/form-data';
				var input=document.createElement("input");
				input.type='file';
				var button=document.createElement("button");
				button.type='submit';
				form.appendChild(input);
				form.appendChild(button);
				body.appendChild(form);
				//
				input.name="fs";
				input.onchange = function(){
				    var file = this.files[0];
				        if(!!file){
				            var reader = new FileReader();
				            reader.readAsArrayBuffer(file);
				            reader.onload = function(){
								console.log(this.result);
				                var binary = this.result;
				                upload(binary);
				        }
				    }
				}
				console.log(input.value);
				input.click();
				console.log(input.value);
				
				body.removeChild(form);
				
				// let xhr1 = new XMLHttpRequest(); 
				// console.log("xhr1");
				// xhr1.onreadystatechange=function(){
				// 	if (xhr1.readyState == 4 && (xhr1.status == 200)) {
				// 		let res = JSON.parse(xhr.responseText);
				// 		// console.log(res.return_type);
				// 		console.log(res.errno);

				// 	}
				// }
				// xhr1.open('POST','https://d.pcs.baidu.com/rest/2.0/pcs/superfile2?access_token='+token+'&method=upload&type=tmpfile&path=/baidu/test/test.txt&uploadid=N1-NjEuMTM1LjE2OS44NDoxNTQ1OTY1NTQyOjgzODMxMTY0MDkyNDY2NjQ5Nzg&partseq=0')
				// xhr1.setRequestHeader("Content-Type","image/png");
				// xhr1.send();
			}
			// function upload(binary){
			//     var xhr = new XMLHttpRequest();
			//     xhr.open("POST", "https://d.pcs.baidu.com/rest/2.0/pcs/superfile2?access_token=7gDtdAkctsK55gtlO3Sq0AsY&method=upload&type=tmpfile&path=/baidu/test/&uploadid=N1-NjEuMTM1LjE2OS44NDoxNTQ1OTY1NTQyOjgzODMxMTY0MDkyNDY2NjQ5Nzg&partseq=0");
			//     xhr.overrideMimeType("text/plain");
			//     //直接发送二进制数据
			//     if(xhr.sendAsBinary){
			//         xhr.sendAsBinary(binary);
			//     }else{
			//         xhr.send(binary);
			//     }
			    
			//     // 监听变化
			//     xhr.onreadystatechange = function(e){
			//         if(xhr.readyState===4){
			//             if(xhr.status===200){
			//                 // 响应成功  
			// 					 console.log("121");
			//             }
			//         }
			//     }
			// }
			
			
			
			
			