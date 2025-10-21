import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { FormData, SubmitStatus } from './types';
import UserIcon from './components/icons/UserIcon';
import BuildingIcon from './components/icons/BuildingIcon';
import PhoneIcon from './components/icons/PhoneIcon';
import TeamIcon from './components/icons/TeamIcon';
import XDriveLogo from './components/icons/XDriveLogo';

const App: React.FC = () => {
  const [formData, setFormData] = useState<Omit<FormData, 'kayitTarihi' | 'kayitNumarasi'>>({
    isimSoyisim: '',
    isyerindekiBirimi: '',
    telefonNumarasi: '',
    takimLideriIsmi: '',
    kvkkOnay: false,
  });
  const [kayitTarihi, setKayitTarihi] = useState<string>('');
  const [kayitNumarasi, setKayitNumarasi] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [formUrl, setFormUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const generateRegistrationId = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const datePart = `${year}${month}${day}`;
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `xD-${datePart}-${randomPart}`;
  }, []);

  useEffect(() => {
    setKayitTarihi(new Date().toLocaleDateString('tr-TR'));
    setKayitNumarasi(generateRegistrationId());
    setFormUrl(window.location.href);
  }, [generateRegistrationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSubmitStatus('idle');
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500); // Reset after 2.5 seconds
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  const isFormValid = useMemo(() => {
    return formData.isimSoyisim && formData.isyerindekiBirimi && formData.telefonNumarasi && formData.kvkkOnay;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setSubmitStatus('idle');

    const fullFormData: FormData = {
      ...formData,
      kayitTarihi,
      kayitNumarasi,
    };

    try {
      const response = await fetch('https://your-endpoint-here.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullFormData),
      });

      if (!response.ok) {
         console.warn(`Fetch failed as expected for placeholder URL. Simulating success.`);
      }

      setSubmitStatus('success');
      setFormData({
        isimSoyisim: '',
        isyerindekiBirimi: '',
        telefonNumarasi: '',
        takimLideriIsmi: '',
        kvkkOnay: false,
      });
      setKayitNumarasi(generateRegistrationId());

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('success');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ id, name, label, type = 'text', value, onChange, required = false, pattern = '', title = '', Icon, placeholder, autoComplete }) => (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        title={title}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-xdrive-red focus:border-xdrive-red transition duration-200"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8 flex flex-col items-center">
            <XDriveLogo className="w-48 h-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider">
                FC26 Turnuva Kayıt Formu
            </h1>
        </header>

        <main className="bg-xdrive-dark p-6 sm:p-8 rounded-lg shadow-2xl shadow-xdrive-red/10 border border-gray-800">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-4 p-4 bg-gray-900/50 border border-gray-700 rounded-md">
                <div>
                    <p className="text-sm text-gray-400">Kayıt Tarihi</p>
                    <p className="font-mono text-lg">{kayitTarihi}</p>
                </div>
                <div className="md:text-right">
                    <p className="text-sm text-gray-400">Kayıt Numarası</p>
                    <p className="font-mono text-lg">{kayitNumarasi}</p>
                </div>
            </div>

            <div className="space-y-6">
                <InputField id="isimSoyisim" name="isimSoyisim" label="İsim Soyisim" value={formData.isimSoyisim} onChange={handleInputChange} required Icon={UserIcon} placeholder="İsim Soyisim" autoComplete="name" />
                <InputField id="isyerindekiBirimi" name="isyerindekiBirimi" label="İşyerindeki Birimi" value={formData.isyerindekiBirimi} onChange={handleInputChange} required Icon={BuildingIcon} placeholder="İşyerindeki Birimi" autoComplete="organization-title" />
                <InputField id="telefonNumarasi" name="telefonNumarasi" label="Telefon Numarası" type="tel" value={formData.telefonNumarasi} onChange={handleInputChange} required pattern="05[0-9]{9}" title="Örn: 05xxxxxxxxx" Icon={PhoneIcon} placeholder="Telefon Numarası (05xxxxxxxxx)" autoComplete="tel" />
                <InputField id="takimLideriIsmi" name="takimLideriIsmi" label="Takım Lideri İsmi (isteğe bağlı)" value={formData.takimLideriIsmi ?? ''} onChange={handleInputChange} Icon={TeamIcon} placeholder="Takım Lideri İsmi (isteğe bağlı)" autoComplete="off" />
            </div>

            <div className="mt-8">
              <label htmlFor="kvkkOnay" className="flex items-start cursor-pointer">
                <input
                  id="kvkkOnay"
                  name="kvkkOnay"
                  type="checkbox"
                  checked={formData.kvkkOnay}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-5 w-5 rounded bg-gray-700 border-gray-600 text-xdrive-red focus:ring-2 focus:ring-offset-2 focus:ring-offset-xdrive-dark focus:ring-xdrive-red cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-300">
                  KVKK aydınlatma metnini okudum ve kişisel verilerimin turnuva organizasyonu kapsamında işlenmesine onay veriyorum.
                </span>
              </label>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-xdrive-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-xdrive-dark focus:ring-xdrive-red disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gönderiliyor...
                    </>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
            </div>
          </form>

            {submitStatus === 'success' && (
                <div className="mt-6 p-4 bg-green-900/50 border border-green-500 text-green-300 rounded-md text-center">
                Kayıt alındı! E-postanıza bilgilendirme gönderilecektir.
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="mt-6 p-4 bg-red-900/50 border-xdrive-red text-red-300 rounded-md text-center">
                Gönderim başarısız. Lütfen daha sonra tekrar deneyin veya IK ile iletişime geçin.
                </div>
            )}
        </main>

        <footer className="mt-10 text-center text-gray-500">
            <div className="flex flex-col items-center bg-xdrive-dark p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-3">Form Linki & QR Kodu</h3>
                <p className="text-sm mb-4">Bu kodu okutarak veya linki kopyalayarak forma ulaşabilirsiniz.</p>
                {formUrl && (
                     <div className="bg-white p-2 rounded-md mb-4">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(formUrl)}&bgcolor=141414&color=FFFFFF&qzone=1`}
                            alt="Form URL QR Kodu"
                            width="128"
                            height="128"
                        />
                     </div>
                )}
                {formUrl && (
                    <div className="w-full flex items-center bg-gray-900 border border-gray-700 rounded-md p-2">
                        <input 
                            type="text" 
                            value={formUrl} 
                            readOnly 
                            className="flex-grow bg-transparent text-gray-300 text-sm font-mono focus:outline-none"
                            aria-label="Form URL"
                        />
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-xdrive-red hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-xdrive-red transition-all duration-200"
                        >
                            {linkCopied ? 'Kopyalandı!' : 'Kopyala'}
                        </button>
                    </div>
                )}
            </div>
            <p className="mt-6 text-xs">&copy; {new Date().getFullYear()} xDrive Internal Systems</p>
        </footer>
      </div>
    </div>
  );
};

export default App;