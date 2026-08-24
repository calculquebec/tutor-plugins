import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@openedx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getLocale } from '@edx/frontend-platform/i18n';

/**
 * Configuration and options for custom extra fields defined in
 * https://github.com/calculquebec/custom-extra-fields
 */
const FIELD_DEFINITIONS = {
  position: {
    type: 'select',
    fieldName: 'position',
    labels: {
      'fr-ca': {
        title: 'Poste',
        helpText: 'Sélectionnez votre poste.',
        emptyText: 'Ajouter un poste',
        placeholder: '-- Sélectionnez une option --',
      },
      en: {
        title: 'Position',
        helpText: 'Select your position.',
        emptyText: 'Add position',
        placeholder: '-- Select an option --',
      },
    },
    options: [
      {
        value: 'undergraduate_student',
        label: {
          'fr-ca': 'Étudiant-e au premier cycle',
          en: 'Undergraduate student',
        },
      },
      {
        value: 'masters_student',
        label: {
          'fr-ca': 'Étudiant-e à la maîtrise',
          en: "Master's student",
        },
      },
      {
        value: 'doctoral_student',
        label: {
          'fr-ca': 'Étudiant-e au doctorat',
          en: 'Doctoral student',
        },
      },
      {
        value: 'postdoctoral_fellow',
        label: {
          'fr-ca': 'Stagiaire post-doctoral',
          en: 'Postdoctoral fellow',
        },
      },
      {
        value: 'professor',
        label: {
          'fr-ca': 'Professeur-e',
          en: 'Professor',
        },
      },
      {
        value: 'research_professional',
        label: {
          'fr-ca': 'Professionnel-le de recherche',
          en: 'Research professional',
        },
      },
      {
        value: 'other',
        label: {
          'fr-ca': 'Autre',
          en: 'Other',
        },
      },
    ],
  },
  research_area: {
    type: 'select',
    fieldName: 'research_area',
    labels: {
      'fr-ca': {
        title: 'Domaine de recherche',
        helpText: 'Sélectionnez votre domaine de recherche.',
        emptyText: 'Ajouter un domaine de recherche',
        placeholder: '-- Sélectionnez une option --',
      },
      en: {
        title: 'Research area',
        helpText: 'Select your research area.',
        emptyText: 'Add research area',
        placeholder: '-- Select an option --',
      },
    },
    options: [
      {
        value: 'natural_sciences',
        label: {
          'fr-ca': 'Sciences naturelles',
          en: 'Natural sciences',
        },
      },
      {
        value: 'engineering_and_technology',
        label: {
          'fr-ca': 'Génie et technologies',
          en: 'Engineering and technology',
        },
      },
      {
        value: 'medical_health_and_life_sciences',
        label: {
          'fr-ca': 'Sciences médicales, de la santé et de la vie',
          en: 'Medical, health and life sciences',
        },
      },
      {
        value: 'agricultural_and_veterinary_sciences',
        label: {
          'fr-ca': 'Sciences agricoles et vétérinaires',
          en: 'Agricultural and veterinary sciences',
        },
      },
      {
        value: 'social_sciences',
        label: {
          'fr-ca': 'Sciences sociales',
          en: 'Social sciences',
        },
      },
      {
        value: 'humanities_and_the_arts',
        label: {
          'fr-ca': 'Sciences humaines et arts',
          en: 'Humanities and the arts',
        },
      },
    ],
  },
  wants_newsletter: {
    type: 'boolean',
    fieldName: 'wants_newsletter',
    labels: {
      'fr-ca': {
        title: "Abonnement à l'infolettre",
        checkboxLabel: "S'abonner à l'infolettre",
        helpText: 'Abonnez-vous à notre infolettre pour recevoir les dernières nouvelles et mises à jour.',
        emptyText: "Définir la préférence d'abonnement à l'infolettre",
        displayTrue: 'Abonné-e',
        displayFalse: 'Non abonné-e',
      },
      en: {
        title: 'Subscribe to newsletter',
        checkboxLabel: 'Subscribe to newsletter',
        helpText: 'Subscribe to our newsletter to get the latest news and updates.',
        emptyText: 'Set newsletter subscription preference',
        displayTrue: 'Subscribed',
        displayFalse: 'Not subscribed',
      },
    },
  },
};

const COMMON_LABELS = {
  'fr-ca': {
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    errorSaving: "Une erreur est survenue lors de l'enregistrement.",
  },
  en: {
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    errorSaving: 'An error occurred while saving.',
  },
};

/**
 * Utility to parse profileFieldValues prop into a key-value dictionary
 */
const parseProfileFieldValues = (profileFieldValues) => {
  const map = {};
  if (Array.isArray(profileFieldValues)) {
    profileFieldValues.forEach((item) => {
      if (!item) return;
      const key = item.fieldName || item.field_name;
      const val = item.fieldValue !== undefined ? item.fieldValue : item.field_value;
      if (key !== undefined) {
        map[key] = val;
      }
    });
  } else if (profileFieldValues && typeof profileFieldValues === 'object') {
    Object.entries(profileFieldValues).forEach(([k, v]) => {
      map[k] = v;
    });
  }
  return map;
};

/**
 * Utility to determine current language ('fr-ca' or 'en')
 */
const detectLanguage = () => {
  try {
    const locale = typeof getLocale === 'function' ? getLocale() : null;
    if (locale) {
      const loc = locale.toLowerCase();
      if (loc.startsWith('fr')) return 'fr-ca';
      if (loc.startsWith('en')) return 'en';
    }
  } catch (e) {
    // getLocale not available or failed
  }

  try {
    const cookieMatch = document.cookie
      .split('; ')
      .find(row => row.startsWith('openedx-language-preference='));
    if (cookieMatch) {
      const val = decodeURIComponent(cookieMatch.split('=')[1]).toLowerCase();
      if (val === 'fr' || val.startsWith('fr-')) return 'fr-ca';
      if (val === 'en' || val.startsWith('en-')) return 'en';
    }

    const docLang = document.documentElement.lang?.toLowerCase();
    if (docLang?.startsWith('fr')) return 'fr-ca';
    if (docLang?.startsWith('en')) return 'en';

    const navLang = navigator.language?.toLowerCase();
    if (navLang?.startsWith('fr')) return 'fr-ca';
    if (navLang?.startsWith('en')) return 'en';
  } catch (e) {
    // Fallback
  }

  return 'fr-ca';
};

/**
 * Individual field editor component
 */
const CustomProfileFieldItem = ({
  config,
  initialValue,
  serverError,
  onSave,
  lang,
  SwitchContent,
  EditableItemHeader,
  EmptyContent,
}) => {
  const [formMode, setFormMode] = useState('editable');
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(serverError);

  const common = COMMON_LABELS[lang] || COMMON_LABELS.en;
  const labels = config.labels[lang] || config.labels.en;

  const isValueEmpty = (val) => val === '' || val === null || val === undefined;

  useEffect(() => {
    setValue(initialValue);
    if (isValueEmpty(initialValue)) {
      setFormMode('empty');
    } else {
      setFormMode('editable');
    }
  }, [initialValue]);

  useEffect(() => {
    if (serverError) {
      const errMessage = typeof serverError === 'object' && serverError !== null
        ? (serverError.user_message || serverError.developer_message || JSON.stringify(serverError))
        : serverError;
      setError(errMessage);
      setFormMode('editing');
    }
  }, [serverError]);

  const handleCancel = () => {
    setValue(initialValue);
    setError(null);
    if (isValueEmpty(initialValue)) {
      setFormMode('empty');
    } else {
      setFormMode('editable');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setError(null);

    let saveVal = value;
    if (config.type === 'boolean') {
      saveVal = value === true || value === 'true' || value === 'True' || value === 1 || value === '1';
    } else if (saveVal === null || saveVal === undefined) {
      saveVal = '';
    }

    try {
      await onSave(config.fieldName, saveVal);
      setIsSaving(false);
      if (isValueEmpty(saveVal)) {
        setFormMode('empty');
      } else {
        setFormMode('editable');
      }
    } catch (err) {
      setIsSaving(false);
      const rawError = err?.processedData?.fieldErrors?.[config.fieldName]
        || err?.response?.data?.field_errors?.[config.fieldName]
        || err?.user_message
        || err?.message
        || common.errorSaving;
      const errMessage = typeof rawError === 'object' && rawError !== null
        ? (rawError.user_message || rawError.developer_message || JSON.stringify(rawError))
        : rawError;
      setError(errMessage);
      setFormMode('editing');
    }
  };

  // Compute display value for editable state
  const getDisplayContent = () => {
    if (config.type === 'boolean') {
      const isTrue = value === true || value === 'true' || value === 'True' || value === 1 || value === '1';
      return isTrue ? labels.displayTrue : labels.displayFalse;
    }

    if (config.type === 'select') {
      const opt = config.options.find(o => o.value === value);
      if (opt) {
        return opt.label[lang] || opt.label.en || value;
      }
      return value || '';
    }

    return String(value || '');
  };

  const displayContent = getDisplayContent();

  const switchCases = {
    editing: (
      <div role="dialog" aria-labelledby={`${config.fieldName}-label`}>
        <form onSubmit={handleSubmit}>
          <div className="form-group m-0 pb-2">
            <label
              className="edit-section-header font-weight-bold"
              htmlFor={config.fieldName}
              id={`${config.fieldName}-label`}
            >
              {labels.title}
            </label>
            {labels.helpText && (
              <p className="text-muted small mb-2">{labels.helpText}</p>
            )}

            {config.type === 'select' && (
              <select
                className="form-control py-10px"
                id={config.fieldName}
                name={config.fieldName}
                value={value || ''}
                onChange={e => setValue(e.target.value)}
                disabled={isSaving}
              >
                <option value="">{labels.placeholder}</option>
                {config.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label[lang] || opt.label.en}
                  </option>
                ))}
              </select>
            )}

            {config.type === 'boolean' && (
              <div className="form-check my-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={config.fieldName}
                  name={config.fieldName}
                  checked={value === true || value === 'true' || value === 'True' || value === 1 || value === '1'}
                  onChange={e => setValue(e.target.checked)}
                  disabled={isSaving}
                />
                <label className="form-check-label ml-2" htmlFor={config.fieldName}>
                  {labels.checkboxLabel || labels.title}
                </label>
              </div>
            )}

            {error && (
              <div className="text-danger mt-1 small" role="alert">
                {error}
              </div>
            )}
          </div>

          <div className="d-flex flex-wrap align-items-center mt-3">
            <Button
              variant="outline-primary"
              className="mr-2"
              onClick={handleCancel}
              disabled={isSaving}
            >
              {common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? common.saving : common.save}
            </Button>
          </div>
        </form>
      </div>
    ),
    editable: (
      <>
        <div className="row m-0 pb-1.5 align-items-center">
          <p data-hj-suppress className="h5 font-weight-bold m-0">
            {labels.title}
          </p>
        </div>
        <EditableItemHeader
          content={displayContent}
          showEditButton
          onClickEdit={() => setFormMode('editing')}
          showVisibility={false}
          visibility="private"
        />
      </>
    ),
    empty: (
      <>
        <div className="row m-0 pb-1.5 align-items-center">
          <p data-hj-suppress className="h5 font-weight-bold m-0">
            {labels.title}
          </p>
        </div>
        <EmptyContent onClick={() => setFormMode('editing')}>
          <p className="mb-0">{labels.emptyText}</p>
        </EmptyContent>
      </>
    ),
  };

  return (
    <SwitchContent
      className="pt-40px"
      expression={formMode}
      cases={switchCases}
    />
  );
};

CustomProfileFieldItem.propTypes = {
  config: PropTypes.object.isRequired,
  initialValue: PropTypes.any,
  serverError: PropTypes.any,
  onSave: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  SwitchContent: PropTypes.elementType.isRequired,
  EditableItemHeader: PropTypes.elementType.isRequired,
  EmptyContent: PropTypes.elementType.isRequired,
};

/**
 * Fallback components if not injected via formComponents
 */
const FallbackSwitchContent = ({ expression, cases, className }) => (
  <div className={className}>{cases[expression] || null}</div>
);

FallbackSwitchContent.propTypes = {
  expression: PropTypes.string,
  cases: PropTypes.object,
  className: PropTypes.string,
};

const FallbackEditableItemHeader = ({ content, onClickEdit, showEditButton }) => (
  <div className="d-flex align-items-center justify-content-between">
    <span className="text-gray-700">{content}</span>
    {showEditButton && (
      <Button variant="link" size="sm" onClick={onClickEdit}>
        Edit
      </Button>
    )}
  </div>
);

FallbackEditableItemHeader.propTypes = {
  content: PropTypes.node,
  onClickEdit: PropTypes.func,
  showEditButton: PropTypes.bool,
};

const FallbackEmptyContent = ({ children, onClick }) => (
  <Button variant="link" className="p-0 text-left" onClick={onClick}>
    + {children}
  </Button>
);

FallbackEmptyContent.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

/**
 * Main plugin widget for AdditionalProfileFieldsSlot
 * Slot ID: org.openedx.frontend.profile.additional_profile_fields.v1
 */
const CustomExtraFields = ({
  updateUserProfile,
  refreshUserProfile,
  profileFieldValues = [],
  profileFieldErrors = {},
  formComponents = {},
}) => {
  const authenticatedUser = getAuthenticatedUser();
  const lang = detectLanguage();

  const SwitchContent = formComponents?.SwitchContent || FallbackSwitchContent;
  const EditableItemHeader = formComponents?.EditableItemHeader || FallbackEditableItemHeader;
  const EmptyContent = formComponents?.EmptyContent || FallbackEmptyContent;

  const [localFieldValues, setLocalFieldValues] = useState(() => parseProfileFieldValues(profileFieldValues));

  useEffect(() => {
    if (profileFieldValues) {
      setLocalFieldValues(prev => ({
        ...parseProfileFieldValues(profileFieldValues),
        ...prev,
        ...parseProfileFieldValues(profileFieldValues),
      }));
    }
  }, [profileFieldValues]);

  const handleFieldSave = async (fieldName, fieldValue) => {
    const username = authenticatedUser?.username;
    if (!username) {
      throw new Error('Username not available');
    }

    // Combine current values from profileFieldValues prop and local state
    const currentMap = {
      ...parseProfileFieldValues(profileFieldValues),
      ...localFieldValues,
    };

    // Ensure all defined custom fields have a valid defined value (prevent undefined)
    Object.entries(FIELD_DEFINITIONS).forEach(([key, def]) => {
      if (currentMap[key] === undefined || currentMap[key] === null) {
        currentMap[key] = def.type === 'boolean' ? false : '';
      }
    });

    // Update the specific field being saved
    currentMap[fieldName] = fieldValue;

    // Build the payload for the server
    const extendedProfilePayload = Object.entries(currentMap).map(([name, val]) => {
      let cleanVal = val;
      if (cleanVal === undefined || cleanVal === null) {
        cleanVal = FIELD_DEFINITIONS[name]?.type === 'boolean' ? false : '';
      }
      return {
        fieldName: name,
        fieldValue: cleanVal,
      };
    });

    // Update local state immediately so subsequent saves retain these values
    setLocalFieldValues(currentMap);

    // Call updateUserProfile (handles both (username, payload) and (payload) signatures)
    let updatedAccount;
    if (typeof updateUserProfile === 'function') {
      if (updateUserProfile.length === 1) {
        updatedAccount = await updateUserProfile({
          extendedProfile: extendedProfilePayload,
        });
      } else {
        updatedAccount = await updateUserProfile(username, {
          extendedProfile: extendedProfilePayload,
        });
      }
    }

    if (updatedAccount && (updatedAccount.extendedProfile || updatedAccount.extended_profile)) {
      const serverReturnedValues = updatedAccount.extendedProfile || updatedAccount.extended_profile;
      setLocalFieldValues(parseProfileFieldValues(serverReturnedValues));
    }

    // Refresh profile in Redux store
    if (typeof refreshUserProfile === 'function') {
      await refreshUserProfile(username);
    }
  };

  const getFieldValue = (fieldName) => {
    if (fieldName in localFieldValues && localFieldValues[fieldName] !== undefined && localFieldValues[fieldName] !== null) {
      return localFieldValues[fieldName];
    }
    const propMap = parseProfileFieldValues(profileFieldValues);
    if (fieldName in propMap && propMap[fieldName] !== undefined && propMap[fieldName] !== null) {
      return propMap[fieldName];
    }
    return '';
  };

  return (
    <div className="custom-extra-fields-section">
      <CustomProfileFieldItem
        key="position"
        config={FIELD_DEFINITIONS.position}
        initialValue={getFieldValue('position')}
        serverError={profileFieldErrors?.position || profileFieldErrors?.['position']}
        onSave={handleFieldSave}
        lang={lang}
        SwitchContent={SwitchContent}
        EditableItemHeader={EditableItemHeader}
        EmptyContent={EmptyContent}
      />

      <CustomProfileFieldItem
        key="research_area"
        config={FIELD_DEFINITIONS.research_area}
        initialValue={getFieldValue('research_area')}
        serverError={profileFieldErrors?.research_area || profileFieldErrors?.['research_area']}
        onSave={handleFieldSave}
        lang={lang}
        SwitchContent={SwitchContent}
        EditableItemHeader={EditableItemHeader}
        EmptyContent={EmptyContent}
      />

      <CustomProfileFieldItem
        key="wants_newsletter"
        config={FIELD_DEFINITIONS.wants_newsletter}
        initialValue={getFieldValue('wants_newsletter')}
        serverError={profileFieldErrors?.wants_newsletter || profileFieldErrors?.['wants_newsletter']}
        onSave={handleFieldSave}
        lang={lang}
        SwitchContent={SwitchContent}
        EditableItemHeader={EditableItemHeader}
        EmptyContent={EmptyContent}
      />
    </div>
  );
};

CustomExtraFields.propTypes = {
  updateUserProfile: PropTypes.func.isRequired,
  refreshUserProfile: PropTypes.func,
  profileFieldValues: PropTypes.any,
  profileFieldErrors: PropTypes.objectOf(PropTypes.any),
  formComponents: PropTypes.shape({
    SwitchContent: PropTypes.elementType,
    EditableItemHeader: PropTypes.elementType,
    EmptyContent: PropTypes.elementType,
  }),
};

