  <>
    <script src='https://kit.fontawesome.com/91003a351d.js' crossOrigin='anonymous'></script>
    <div>
      <div className='banner'>
        <div className='cover-filter'></div>
        <img
          src='https://edx.evolo.calculquebec.cloud/asset-v1:CQ+Assets101+2026+type@asset+block@logo_bandeau.png'
          alt='Logo'
        />
      </div>
      <div className='page-back'>
        <div className='back-icon' onClick={pageBack}>
          <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
            <path d='M12.465 2.24254C12.0975 1.87504 11.505 1.87504 11.1375 2.24254L4.905 8.47504C4.6125 8.76754 4.6125 9.24004 4.905 9.53254L11.1375 15.765C11.505 16.1325 12.0975 16.1325 12.465 15.765C12.8325 15.3975 12.8325 14.805 12.465 14.4375L7.035 9.00004L12.4725 3.56254C12.8325 3.20254 12.8325 2.60254 12.465 2.24254Z' />
          </svg>
        </div>
        <h2 className='page-title'>{pageTitle.split('|')[0].trim()}</h2>
      </div>
    </div>
  </>
