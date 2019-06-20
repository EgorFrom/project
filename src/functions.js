module.exports.fetchIplayInEDG = function(updateRegToken) {
	fetch("https://eardrum.ru:8890/user/IplayInEDG", {
	        method: "POST",
	        headers: {
	          "Content-type": "application/json",
	          "accept": "application/json"
	        },
	        body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
	      }).then(resp => {
	        if (resp.status === 200) {
	          return resp.json();
	        } else return "Error 400023";
	      }).then(data => {
	        updateRegToken(data)
	      });
}

module.exports.fetchMinusStamina = function(setPage, name, openModal, closeModal, UpdatePage) {
	fetch("https://eardrum.ru:8890/user/minusStamina", {
	        method: "POST",
	        headers: {
	          "Content-type": "application/json",
	          "accept": "application/json"
	        },
	        body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
	      }).then(resp => {
	        if (resp.status === 200) {
	          return resp.json();
	        } else return "Error 40008";
	      }).then(data => {
	        if (data.error != undefined)
	        {
	          if (data.error == 'Ошибка, не хватает энергии'){
	            openModal("У вас не хватает энергии!");
	            return;
	          }
	          localStorage[1] = 'undefined';
	          openModal("Пора войти в аккаунт!");
	          setTimeout(() => {closeModal()}, 1500);
	          setTimeout(() => {UpdatePage("Enter");}, 1600);
	        } else {
	          setPage(name);
	        }
	      });
}

module.exports.fetchCanIPlay = function(setPage, name, openModal, closeModal, UpdatePage, updateUnregToken){
	fetch("https://eardrum.ru:8890/user/canIPlay", {
	      method: "POST",
	      headers: {
	        "Content-type": "application/json",
	        "accept": "application/json"
	      },
	      body: JSON.stringify({token: localStorage[0]})
	    }).then(resp => {
	      if (resp.status === 200) {
	        return resp.json();
	      } else return "Error 40009";
	    }).then(data => {
	      if (data.error != undefined)
	      {
	        openModal("Пора войти в аккаунт!");
	        setTimeout(() => {closeModal()}, 1500);
	        setTimeout(() => {UpdatePage("Enter");}, 1600);
	      } else {
	        updateUnregToken(data.access_token);
	        setPage(name);
	      }
	    });
}

module.exports.fetchCanIPlayEDGAndfetchMinusStamina = function(setPage, name, openModal, closeModal, UpdatePage) {
	fetch("https://eardrum.ru:8890/user/canIPlayEDG", {
	        method: "POST",
	        headers: {
	          "Content-type": "application/json",
	          "accept": "application/json"
	        },
	        body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
	      }).then(resp => {
	        if (resp.status === 200) {
	          return resp.json();
	        } else return "Error 40008";
	      }).then(data => {
	        if (data.error != undefined){
	          openModal("Вы уже играли сегодня");
	          setTimeout(() => {closeModal()}, 1500);
	          setTimeout(() => {UpdatePage("Profile");}, 1600);
	        }
	        else
	        fetch("https://eardrum.ru:8890/user/minusStamina", {
	                method: "POST",
	                headers: {
	                  "Content-type": "application/json",
	                  "accept": "application/json"
	                },
	                body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
	              }).then(resp => {
	                if (resp.status === 200) {
	                  return resp.json();
	                } else return "Error 40008";
	              }).then(data2 => {
	                if (data2.error != undefined)
	                {
	                  if (data2.error == 'Ошибка, не хватает энергии'){
	                    openModal("У вас не хватает энергии!");
	                    return;
	                  }
	                  localStorage[1] = 'undefined';
	                  openModal("Пора войти в аккаунт!");
	                  setTimeout(() => {closeModal()}, 1500);
	                  setTimeout(() => {UpdatePage("Enter");}, 1600);
	                } else {
	                  setPage(name);
	                }
	              });
	      });
}

module.exports.fetchMessages = function(openModal, closeModal) {
	fetch("https://eardrum.ru:8890/user/messages", {
	        method: "POST",
	        headers: {
	          "Content-type": "application/json",
	          "accept": "application/json"
	        },
	        body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
	      }).then(resp => {
	        if (resp.status === 200) {
	          return resp.json();
	        } else return "Error 400023";
	      }).then(data => {
	      	if (data.message != undefined){
	      		openModal(data.message);
	      	}
	      });	
}