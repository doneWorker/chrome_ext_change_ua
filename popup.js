let uaListEl = document.getElementById('ua-list');
let errElem = document.getElementById('error');

let uaName = document.getElementById('ua-name');
let uaVal = document.getElementById('ua-value');
let uaAdd = document.getElementById('ua-add');
let uaConfirm = document.getElementById('ua-confirm');
let currentUa = document.getElementById('ua-current');
let uaReset = document.getElementById('reset');


function getCurrentUAFromStorage(callback) {
	chrome.storage.local.get(['currentUA'], function(data) {
        callback(data.currentUA);
      });
}

function removeUAItemFromStorage(name) {
	getUAListFromStorage(function(list) {
		const newList = list.ualist.filter(item => item.name !== name);
		saveNewUaList(newList);
	});
}

function getUAListFromStorage(callback) {
	chrome.storage.local.get('ualist', function(list) {
		callback(list);
	});
}

function saveNewUaList(list, callback) {
	chrome.storage.local.set({ualist: list}, callback);
}

function addUAToStorage(name, val, callback) {
	getUAListFromStorage(function(list) {
		let newArr = list.ualist;
		newArr.push({name: name, value: val});
		saveNewUaList(newArr, callback);
	});
}

function updateForm() {
	uaListEl.innerHTML = '';
	getUAListFromStorage(function(list) {
		list.ualist.forEach((item) => {
			let option = document.createElement('option');
			option.name = item.name;
			option.value = item.value;
			option.innerText = item.name;
			uaListEl.appendChild(option);
		});
	});

	getCurrentUAFromStorage(function(str) {
		currentUa.value = str;
	});
}

function showError(msg) {
	errElem.textContent = msg;
	errElem.classList.add('show');
	setTimeout(function() {
		errElem.classList.remove('show');
	}, 2000);
}

function uaAddHandler() {
	let name = uaName.value;
	let val = uaVal.value;

	if(name !== "" && val !== "") {
		addUAToStorage(name, val, updateForm);
		uaName.value = "";
		uaVal.value = "";
	} else {
		showError('Please fill all fields');
	}
}

function confirmUserAgent() {
	let val = uaListEl.value;
	chrome.storage.local.set({currentUA: val});
	chrome.runtime.sendMessage("updateua");
	currentUa.value = val;
	uaListEl.removeAttribute("value");
}

function resetUserAgent() {
	chrome.storage.local.set({currentUA: "default"});
	chrome.runtime.sendMessage("updateua");
	currentUa.value = "default";
}



updateForm();
uaAdd.addEventListener('click', uaAddHandler);
uaConfirm.addEventListener('click', confirmUserAgent);
uaReset.addEventListener('click', resetUserAgent);

