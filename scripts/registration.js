if (document.URL.split('/').pop() == 'welcome' && getLanguage() == 'en') {
  labels = document.getElementsByClassName('pgn__form-control-floating-label-text');
  labels[0].textContent = 'Academic position';
  labels[1].textContent = 'Research area';
  labels2 = document.getElementsByClassName('pgn__form-label');
  labels2[0].textContent = 'Subscribe to the newsletter';
  
  
  positionSelector = document.getElementById('position');
  positionSelector.options[0].text = 'Academic position';
  positionSelector.options[2].text = 'Undergrad student';
  positionSelector.options[3].text = 'Master student';
  positionSelector.options[4].text = 'Doctoral student';
  positionSelector.options[5].text = 'Post-doctoral student';
  positionSelector.options[6].text = 'Professor';
  positionSelector.options[7].text = 'Research professional';
  positionSelector.options[8].text = 'Other';
  
  researchAreaSelector = document.getElementById('research_area');
  researchAreaSelector.options[0].text = 'Research area';
  researchAreaSelector.options[2].text = 'Natural sciences';
  researchAreaSelector.options[3].text = 'Engineering and technology';
  researchAreaSelector.options[4].text = 'Medical and health sciences';
  researchAreaSelector.options[5].text = 'Agricultural and veterinary sciences';
  researchAreaSelector.options[6].text = 'Social sciences';
  researchAreaSelector.options[7].text = 'Humanities and the arts';
}

