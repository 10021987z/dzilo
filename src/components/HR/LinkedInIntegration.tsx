import React, { useState } from 'react';
import { Link2, Check, X, Link as ExternalLink, Linkedin, Globe, Share2, Copy, Info, AlertCircle, Image, Video, Plus } from 'lucide-react';

interface LinkedInIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobDescription: string;
  onConnect: (linkedInData: any) => void;
}

const LinkedInIntegration: React.FC<LinkedInIntegrationProps> = ({
  isOpen,
  onClose,
  jobTitle,
  jobDescription,
  onConnect
}) => {
  const [step, setStep] = useState<'connect' | 'configure' | 'preview' | 'success'>('connect');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [linkedInProfile, setLinkedInProfile] = useState<any>(null);
  const [shareSettings, setShareSettings] = useState({
    shareToCompanyPage: true,
    shareToPersonalProfile: false,
    notifyFollowers: true,
    includeHashtags: true,
    customHashtags: ['hiring', 'jobs', 'careers'],
    includeMedia: true
  });
  const [postText, setPostText] = useState(
    `Nous recrutons ! 🚀\n\n${jobTitle}\n\nRejoignez notre équipe et participez à notre croissance. Postulez dès maintenant !\n\n#hiring #jobs #careers`
  );
  const [selectedMedia, setSelectedMedia] = useState<{
    type: 'image' | 'video';
    url: string;
  } | null>({
    type: 'image',
    url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
  });

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate LinkedIn OAuth flow
    setTimeout(() => {
      setIsConnecting(false);
      setLinkedInProfile({
        name: 'Dziljo SaaS',
        profileUrl: 'https://www.linkedin.com/company/dziljo-saas',
        followers: 1250,
        logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      });
      setStep('configure');
    }, 2000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    
    // Simulate publishing to LinkedIn
    setTimeout(() => {
      setIsPublishing(false);
      setStep('success');
      
      // Pass the data back to the parent component
      onConnect({
        linkedInProfile,
        shareSettings,
        postText,
        selectedMedia,
        publishedAt: new Date().toISOString()
      });
    }, 2000);
  };

  const handleHashtagChange = (index: number, value: string) => {
    const newHashtags = [...shareSettings.customHashtags];
    newHashtags[index] = value.replace(/\s+/g, ''); // Remove spaces
    setShareSettings({
      ...shareSettings,
      customHashtags: newHashtags
    });
  };

  const addHashtag = () => {
    setShareSettings({
      ...shareSettings,
      customHashtags: [...shareSettings.customHashtags, '']
    });
  };

  const removeHashtag = (index: number) => {
    setShareSettings({
      ...shareSettings,
      customHashtags: shareSettings.customHashtags.filter((_, i) => i !== index)
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://www.linkedin.com/company/dziljo-saas/jobs/${Date.now()}`);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Lien copié dans le presse-papier !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleMediaChange = (type: 'image' | 'video') => {
    let url = '';
    
    if (type === 'image') {
      url = prompt('Entrez l\'URL de l\'image:') || '';
    } else {
      url = prompt('Entrez l\'URL de la vidéo (YouTube, Vimeo, etc.):') || '';
    }
    
    if (url) {
      setSelectedMedia({ type, url });
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-[#0077B5] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Intégration LinkedIn</h1>
                <p className="text-white/80">Publiez votre offre d'emploi sur LinkedIn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {[
                { id: 'connect', title: 'Connexion' },
                { id: 'configure', title: 'Configuration' },
                { id: 'preview', title: 'Aperçu' },
                { id: 'success', title: 'Publication' }
              ].map((s) => (
                <div key={s.id} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step === s.id 
                        ? 'bg-white text-[#0077B5]' 
                        : ['success', 'preview', 'configure'].includes(step) && s.id === 'connect' || 
                          ['success', 'preview'].includes(step) && s.id === 'configure' ||
                          step === 'success' && s.id === 'preview'
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/30 text-white'
                    }`}
                  >
                    {['success', 'preview', 'configure'].includes(step) && s.id === 'connect' || 
                     ['success', 'preview'].includes(step) && s.id === 'configure' ||
                     step === 'success' && s.id === 'preview' 
                      ? <Check className="w-5 h-5" /> 
                      : step === s.id 
                        ? <span className="font-bold">{['connect', 'configure', 'preview', 'success'].indexOf(s.id) + 1}</span>
                        : <span>{['connect', 'configure', 'preview', 'success'].indexOf(s.id) + 1}</span>}
                  </div>
                  <span className="text-sm text-white/80 text-center hidden md:block">{s.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-white/30 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${
                  step === 'connect' ? 25 :
                  step === 'configure' ? 50 :
                  step === 'preview' ? 75 : 100
                }%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 'connect' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-[#0077B5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Linkedin className="w-10 h-10 text-[#0077B5]" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Connectez-vous à LinkedIn</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Pour publier votre offre d'emploi sur LinkedIn, vous devez d'abord connecter votre compte.
                </p>
                
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-[#0077B5] text-white px-6 py-3 rounded-lg hover:bg-[#0077B5]/90 transition-colors flex items-center justify-center mx-auto"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <Linkedin className="w-5 h-5 mr-2" />
                      Se connecter avec LinkedIn
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Pourquoi se connecter à LinkedIn ?</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      La connexion à LinkedIn vous permet de :
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                      <li>Publier directement vos offres d'emploi sur votre page entreprise</li>
                      <li>Atteindre des millions de professionnels qualifiés</li>
                      <li>Suivre les performances de vos publications</li>
                      <li>Recevoir des candidatures directement depuis LinkedIn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'configure' && linkedInProfile && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={linkedInProfile.logo} 
                    alt={linkedInProfile.name} 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-slate-900">{linkedInProfile.name}</h3>
                    <p className="text-sm text-slate-600">{linkedInProfile.followers} abonnés</p>
                    <a 
                      href={linkedInProfile.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir le profil
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Options de partage</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Partager sur la page entreprise</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={shareSettings.shareToCompanyPage}
                        onChange={(e) => setShareSettings({...shareSettings, shareToCompanyPage: e.target.checked})}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setShareSettings({...shareSettings, shareToCompanyPage: !shareSettings.shareToCompanyPage})}
                        className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                          shareSettings.shareToCompanyPage ? 'bg-[#0077B5]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                            shareSettings.shareToCompanyPage ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`}
                        ></div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Partager sur votre profil personnel</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={shareSettings.shareToPersonalProfile}
                        onChange={(e) => setShareSettings({...shareSettings, shareToPersonalProfile: e.target.checked})}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setShareSettings({...shareSettings, shareToPersonalProfile: !shareSettings.shareToPersonalProfile})}
                        className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                          shareSettings.shareToPersonalProfile ? 'bg-[#0077B5]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                            shareSettings.shareToPersonalProfile ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`}
                        ></div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Notifier les abonnés</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={shareSettings.notifyFollowers}
                        onChange={(e) => setShareSettings({...shareSettings, notifyFollowers: e.target.checked})}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setShareSettings({...shareSettings, notifyFollowers: !shareSettings.notifyFollowers})}
                        className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                          shareSettings.notifyFollowers ? 'bg-[#0077B5]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                            shareSettings.notifyFollowers ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`}
                        ></div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Inclure média (photo/vidéo)</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={shareSettings.includeMedia}
                        onChange={(e) => setShareSettings({...shareSettings, includeMedia: e.target.checked})}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setShareSettings({...shareSettings, includeMedia: !shareSettings.includeMedia})}
                        className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                          shareSettings.includeMedia ? 'bg-[#0077B5]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                            shareSettings.includeMedia ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`}
                        ></div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Media Selection */}
              {shareSettings.includeMedia && (
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Média</h3>
                  
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={() => handleMediaChange('image')}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {selectedMedia?.type === 'image' ? 'Changer l\'image' : 'Ajouter une image'}
                    </button>
                    <button
                      onClick={() => handleMediaChange('video')}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {selectedMedia?.type === 'video' ? 'Changer la vidéo' : 'Ajouter une vidéo'}
                    </button>
                    {selectedMedia && (
                      <button
                        onClick={removeMedia}
                        className="bg-slate-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Supprimer
                      </button>
                    )}
                  </div>
                  
                  {selectedMedia && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      {selectedMedia.type === 'image' ? (
                        <img 
                          src={selectedMedia.url} 
                          alt="LinkedIn post" 
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="relative pb-[56.25%] h-0">
                          <iframe 
                            src={selectedMedia.url} 
                            title="LinkedIn post video"
                            className="absolute top-0 left-0 w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Texte du post LinkedIn
                </label>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre offre d'emploi..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  {postText.length}/1300 caractères
                </p>
              </div>

              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Hashtags</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={shareSettings.includeHashtags}
                      onChange={(e) => setShareSettings({...shareSettings, includeHashtags: e.target.checked})}
                      className="sr-only"
                    />
                    <div
                      onClick={() => setShareSettings({...shareSettings, includeHashtags: !shareSettings.includeHashtags})}
                      className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                        shareSettings.includeHashtags ? 'bg-[#0077B5]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          shareSettings.includeHashtags ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`}
                      ></div>
                    </div>
                  </div>
                </label>
                
                {shareSettings.includeHashtags && (
                  <div className="space-y-2">
                    {shareSettings.customHashtags.map((hashtag, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">#</span>
                          <input
                            type="text"
                            value={hashtag}
                            onChange={(e) => handleHashtagChange(index, e.target.value)}
                            className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="hashtag"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHashtag(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addHashtag}
                      className="text-[#0077B5] hover:text-[#0077B5]/80 text-sm font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un hashtag
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Conseils pour maximiser la visibilité</h3>
                    <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                      <li>Utilisez 3-5 hashtags pertinents pour votre secteur</li>
                      <li>Incluez un appel à l'action clair</li>
                      <li>Mentionnez les avantages clés du poste</li>
                      <li>Ajoutez une image ou une vidéo pour augmenter l'engagement</li>
                      <li>Publiez entre 9h et 11h en semaine pour une meilleure visibilité</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-4 mb-4">
                  <img 
                    src={linkedInProfile.logo} 
                    alt={linkedInProfile.name} 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-slate-900">{linkedInProfile.name}</h3>
                    <p className="text-xs text-slate-500">Il y a quelques secondes • <Globe className="w-3 h-3 inline" /></p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-slate-700 whitespace-pre-line">{postText}</p>
                  
                  {shareSettings.includeHashtags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {shareSettings.customHashtags.map((hashtag, index) => (
                        <span key={index} className="text-[#0077B5] text-sm">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {shareSettings.includeMedia && selectedMedia && (
                  <div className="mb-4">
                    {selectedMedia.type === 'image' ? (
                      <img 
                        src={selectedMedia.url} 
                        alt="LinkedIn post" 
                        className="w-full rounded-lg"
                      />
                    ) : (
                      <div className="relative pb-[56.25%] h-0">
                        <iframe 
                          src={selectedMedia.url} 
                          title="LinkedIn post video"
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 p-4">
                    <h4 className="font-medium text-slate-900">{jobTitle}</h4>
                    <p className="text-sm text-slate-600 mt-1">{linkedInProfile.name} • Paris, France</p>
                    <div className="flex items-center mt-2 text-xs text-slate-500">
                      <span className="mr-3">Temps plein</span>
                      <span>0 candidature</span>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <button className="bg-[#0077B5] text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Postuler
                    </button>
                    <button className="text-[#0077B5] hover:text-[#0077B5]/80 text-sm font-medium">
                      Enregistrer
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 text-slate-500 text-sm">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center">
                      <span className="mr-1">0</span>
                      <span>J'aime</span>
                    </button>
                    <button className="flex items-center">
                      <span className="mr-1">0</span>
                      <span>Commentaires</span>
                    </button>
                  </div>
                  <button className="flex items-center">
                    <Share2 className="w-4 h-4 mr-1" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Aperçu de la publication</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Voici comment votre publication apparaîtra sur LinkedIn. Vérifiez que tout est correct avant de publier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Publication Réussie !</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Votre offre d'emploi a été publiée avec succès sur LinkedIn. Vous pouvez maintenant suivre les performances de votre publication.
              </p>
              
              <div className="flex flex-col items-center space-y-4">
                <a 
                  href={linkedInProfile.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#0077B5] text-white px-6 py-3 rounded-lg hover:bg-[#0077B5]/90 transition-colors flex items-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Voir sur LinkedIn
                </a>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`https://www.linkedin.com/company/dziljo-saas/jobs/${Date.now()}`}
                    readOnly
                    className="px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 text-sm"
                  />
                  <button
                    onClick={copyLink}
                    className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-between">
            {step === 'connect' ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
            ) : step === 'success' ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Fermer
              </button>
            ) : (
              <button
                onClick={() => setStep(step === 'configure' ? 'connect' : 'configure')}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Retour
              </button>
            )}

            {step === 'connect' ? (
              <div></div>
            ) : step === 'configure' ? (
              <button
                onClick={() => setStep('preview')}
                className="px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#0077B5]/90 transition-colors"
              >
                Aperçu
              </button>
            ) : step === 'preview' ? (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#0077B5]/90 transition-colors flex items-center"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publication...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Publier sur LinkedIn
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInIntegration;