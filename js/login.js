let accountInput = document.getElementById('account'); //获取账号输入框实例
let account = accountInput.value;
let passwordInput = document.getElementById('password'); //获取密码输入框实例
let password = passwordInput.value;
let loginBtn = document.getElementById('login'); //获取登录按钮实例
let mask = document.getElementsByClassName('overlay')[0];
let popup = document.getElementById('popup');
let message = document.getElementById('message');

		window.onload=()=>{
			// clear();
			document.addEventListener('plusready',function(){
				// console.log(plus);
			})
		
		}
function handleInput(e) { //实时监控账号输入框和密码输入框的变化,并根据值的变化更改登陆按钮的颜色
	if (e.id === 'account') {
		account = e.value;
	} else if (e.id === 'password') {
		password = e.value;
	}
	if (account && password) { //当两个输入框均有值时，登陆按钮才启用
		loginBtn.className = 'active';
	} else {
		loginBtn.className = 'disabled';
	}
}

function changeVisable(e) { //切换密码框的可见性
	if (e.src.indexOf('open') !== -1) {
		e.src = 'img/hide.png';
		passwordInput.type = 'text';
	} else {
		e.src = 'img/open.png';
		passwordInput.type = 'password';
	}
}

function login() { //登陆判断
	if (loginBtn.className === 'disabled') return;
	if(account&&password){
		mask.style.display='block';
		popup.style.display='block';
		message.innerText='登录成功';
	}
}
function clear(){
	localStorage.clear();
}
function closePopup() { //关闭弹出框
	if (message.innerText === '登录成功') {
		mask.style.display = 'none';
		popup.style.display = 'none';
		window.history.length=0;
		let w=plus.webview.open('http://openapi.baidu.com/oauth/2.0/authorize?response_type=token&client_id=7gDtdAkctsK55gtlO3Sq0AsY&redirect_uri=oob&scope=basic,netdisk&display=popup');
		w.addEventListener('loaded',function(){
			var temp=w.getURL();
			if(temp.indexOf('openapi.baidu.com/oauth/2.0/login_success')>0){
				let arr=temp.split('&');
				let token=arr[1].split('=')[1];
				console.log(token);
				localStorage.setItem('token',token);
				let url=window.location.href.slice(0,window.location.href.lastIndexOf('/'));
				w.loadURL(url+'/home.html');
			}});
		} 
		else {
		mask.style.display = 'none';
		popup.style.display = 'none';
	}
}
