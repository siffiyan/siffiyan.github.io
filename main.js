var _url = "https://my-json-server.typicode.com/siffiyan1/pwaapi/aktifitas";

function renderPage(data){
	
	$('#isi_tabel').empty();

		$.each(data,function(key,items){
			$('#isi_tabel').append(`
				<tr>
				<td>`+(key+1)+`</td>
				<td>`+items.nama+`</td>
			    </tr>>
			`)
		})

}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

var networkDataReceived = false

// fresh data from online

var networkUpdate = fetch(_url).then(function(response){
	return response.json()
}).then(function(data){
	networkDataReceived = true;
	renderPage(data)
})

// return data from cache

caches.match(_url).then(function(response){
	if(!response) throw Error('no data on cache')
	return response.json()
}).then(function(data){
	if(!networkDataReceived){
		renderPage(data)
		console.log('render data from cache')
	}
}).catch(function(){
	return networkUpdate
})

