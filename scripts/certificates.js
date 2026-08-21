if (document.URL.split('/')[3] == 'certificates') {
	if (getLanguage() != 'en') {
        print_button = document.getElementById('action-print-view');
        print_button.childNodes[2].textContent='Imprimer l\'attestation'
		linkedin_button = document.getElementById('action-share-linkedin');
		linkedin_button.title = 'Ajouter à votre profile LinkedIn';
    }
}