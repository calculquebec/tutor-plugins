import {
  BsFacebook as BsFacebookIcon,
  BsLinkedin as BsLinkedinIcon,
  BsMastodon as BsMastodonIcon,
  BsWhatsapp as BsWhatsappIcon,
  BsMicrosoftTeams as BsMicrosoftTeamsIcon,
  Email as EmailIcon,
} from '@openedx/paragon/icons';

const modifySocialLinks = (widget) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const isEn = (getCookie('openedx-language-preference') || navigator.language || '').toLowerCase().startsWith('en');

  const courseData = widget.props?.courseAboutData || widget.RenderWidget?.props?.courseAboutData || {};
  const courseName = courseData.name || '';
  const pageUrl = window.location.href;

  const encodedUrl = encodeURIComponent(pageUrl);
  const shareText = isEn
    ? `Join this course on evolo: ${courseName}`
    : `Participez à ce cours sur evolo: ${courseName}`;
  const encodedText = encodeURIComponent(shareText);

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  const mastodonShareUrl = `https://mastodonshare.com/?text=${encodedText}&url=${encodedUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const teamsShareUrl = `https://teams.microsoft.com/share?href=${encodedUrl}&msgText=${encodedText}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(courseName)}&body=${encodedText}%20${encodedUrl}`;

  const newSocialLinks = [
    {
      id: 'facebook',
      destination: facebookShareUrl,
      icon: BsFacebookIcon,
      screenReaderText: isEn ? 'Share on Facebook' : 'Partager sur Facebook',
    },
    {
      id: 'linkedin',
      destination: linkedinShareUrl,
      icon: BsLinkedinIcon,
      screenReaderText: isEn ? 'Share on LinkedIn' : 'Partager sur LinkedIn',
    },
    {
      id: 'mastodon',
      destination: mastodonShareUrl,
      icon: BsMastodonIcon,
      screenReaderText: isEn ? 'Share on Mastodon' : 'Partager sur Mastodon',
    },
    {
      id: 'whatsapp',
      destination: whatsappShareUrl,
      icon: BsWhatsappIcon,
      screenReaderText: isEn ? 'Share on WhatsApp' : 'Partager sur WhatsApp',
    },
    {
      id: 'teams',
      destination: teamsShareUrl,
      icon: BsMicrosoftTeamsIcon,
      screenReaderText: isEn ? 'Share on Microsoft Teams' : 'Partager sur Microsoft Teams',
    },
    {
      id: 'email',
      destination: emailShareUrl,
      icon: EmailIcon,
      screenReaderText: isEn ? 'Share by email' : 'Partager par courriel',
    },
  ];

  widget.content = widget.content || {};
  widget.content.socialLinks = newSocialLinks;
  return widget;
};

