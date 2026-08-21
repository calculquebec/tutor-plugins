if (document.URL.split('/')[3] == 'certificates') {
    if (getLanguage() != 'en') {
        print_button = document.getElementById('action-print-view');
        print_button.childNodes[2].textContent='Imprimer l\'attestation'
        linkedin_button = document.getElementById('action-share-linkedin');
        linkedin_button.title = 'Ajouter à votre profile LinkedIn';

        date_elements = document.getElementsByClassName('inline-certificate-accomplishment-date');
        date_parts = date_elements[0].childNodes[1].childNodes[3].textContent.split(' ');
        date_elements[0].childNodes[1].childNodes[3].textContent = date_parts[1].replace(',','') + ' ' + date_parts[0].toLowerCase() + ' ' + date_parts[2];
        document.getElementsByClassName('accomplishment-date')[1].childNodes[3].textContent = date_parts[1].replace(',','') + ' ' + date_parts[0].toLowerCase() + ' ' + date_parts[2];
    }
    else {
        document.getElementsByClassName('introduction-copy')[0].textContent = 'Calcul Québec recognizes the following accomplishment:';
        document.getElementsByClassName('accomplishment-type-label')[0].textContent = 'This document recognizes that';
        document.getElementsByClassName('accomplishment-summary')[0].textContent = 'has succeeded the online training';
        document.getElementsByClassName('accomplishment-statement-detail')[0].textContent = 'on Calcul Québec\'s evolo platform';
        document.getElementsByClassName('inline-certificate-accomplishment-date')[0].childNodes[1].childNodes[1].textContent = 'Issued on';
        document.getElementsByClassName('inline-certificate-accomplishment-id')[0].childNodes[1].childNodes[1].textContent = 'Certificate';
        document.getElementsByClassName('accomplishment-date')[1].childNodes[1].textContent = 'Issued on';
        document.getElementsByClassName('accomplishment-id')[1].childNodes[1].textContent = 'Certificate';
    }
}
