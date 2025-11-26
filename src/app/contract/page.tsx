'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContractPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', parentName: '', parentMobile: '', email: '', dateOfBirth: '',
        aadharNumber: '', panNumber: '', mobileNumber: '', permanentAddress: '', currentAddress: '',
        workLocation: '', vehicleType: 'motorcycle', vehicleNumber: '', licenseNumber: '',
        acceptanceDate: new Date().toISOString().split('T')[0], signedLocation: '',
        hasLicense: false, hasVehicleDocs: false, ownDocuments: false, agreeTerms: false
    });
    const [files, setFiles] = useState<Record<string, File | null>>({
        aadhar: null, license: null, pan: null, rc: null, insurance: null, puc: null
    });
    const [submitted, setSubmitted] = useState(false);
    const [validated, setValidated] = useState(false);

    const isBicycle = formData.vehicleType === 'bike';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'workLocation' ? { signedLocation: value } : {}),
            ...(name === 'vehicleType' && value === 'bike' ? { vehicleNumber: '', licenseNumber: '', hasLicense: false, hasVehicleDocs: false } : {})
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: fileList } = e.target;
        if (fileList && fileList[0]) setFiles(prev => ({ ...prev, [name]: fileList[0] }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setSubmitted(true);

        try {
            const response = await fetch('/send-email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Submission error:', result);
                alert('Submission failed: ' + (result.error || 'Unknown error'));
                setSubmitted(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit. Please try again or contact us directly.');
            setSubmitted(false);
        }
    };

    const inputClass = `w-full px-3 py-1.5 text-sm border rounded ${validated ? 'invalid:border-red-500 invalid:ring-1 invalid:ring-red-500' : ''}`;
    const fileClass = `w-full text-xs border rounded p-1 ${validated ? 'invalid:border-red-500 invalid:ring-1 invalid:ring-red-500' : ''}`;

    if (submitted) return (<div className="min-h-screen bg-gray-50 py-12 px-4"><div className="container mx-auto max-w-2xl text-center"><div className="bg-white rounded-lg shadow-lg p-6"><div className="text-green-600 text-5xl mb-3">✓</div><h3 className="text-2xl font-bold mb-2">{t('contract.success.title')}</h3><p className="text-gray-600 mb-4">{t('contract.success.message')}</p><a href="/" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700">{t('nav.home')}</a></div></div></div>);

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <h1 className="text-2xl font-bold mb-2">{t('contract.title')}</h1>
                    <p className="text-sm text-gray-600">{t('contract.subtitle')}</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                    <h3 className="font-bold text-blue-900 mb-1 text-sm">📋 {t('contract.key_terms')}</h3>
                    <ul className="text-xs text-blue-800 space-y-0.5">
                        <li>• {t('contract.terms.trial')}</li>
                        <li>• {t('contract.terms.payment')}</li>
                        <li>• {t('contract.terms.policy')}</li>
                        <li>• {t('contract.terms.work')}</li>
                        <li>• {t('contract.terms.insurance')}</li>
                        <li>• {t('contract.terms.risk')}</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} noValidate className="bg-white rounded-lg shadow p-4 space-y-3">
                    <h2 className="text-lg font-bold mb-2">{t('contract.rider_info')}</h2>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.firstName')}</label><input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.lastName')}</label><input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.parentName')}</label><input type="text" name="parentName" value={formData.parentName || ''} onChange={handleChange} className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.parentMobile')}</label><input type="tel" name="parentMobile" value={formData.parentMobile || ''} onChange={handleChange} pattern="[0-9]{10}" className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.email')}</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.dob')}</label><input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.aadhar')}</label><input type="text" name="aadharNumber" value={formData.aadharNumber || ''} onChange={handleChange} pattern="[0-9]{12}" maxLength={12} className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.pan')}</label><input type="text" name="panNumber" value={formData.panNumber || ''} onChange={handleChange} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" className={`${inputClass} uppercase`} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.mobile')}</label><input type="tel" name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleChange} pattern="[0-9]{10}" className={inputClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.workLocation')}</label><input type="text" name="workLocation" value={formData.workLocation || ''} onChange={handleChange} className={inputClass} required /></div>
                    </div>

                    <div><label className="block text-xs font-medium mb-1">{t('contract.form.permAddress')}</label><textarea name="permanentAddress" value={formData.permanentAddress || ''} onChange={handleChange} rows={2} className={inputClass} required /></div>
                    <div><label className="block text-xs font-medium mb-1">{t('contract.form.currAddress')}</label><textarea name="currentAddress" value={formData.currentAddress || ''} onChange={handleChange} rows={2} className={inputClass} required /></div>

                    <h2 className="text-lg font-bold mb-2 pt-2">{t('contract.vehicle_info')}</h2>
                    <div className="grid md:grid-cols-3 gap-3">
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.vehicleType')}</label><select name="vehicleType" value={formData.vehicleType || 'motorcycle'} onChange={handleChange} className={inputClass} required><option value="motorcycle">{t('contract.form.vehicle.motorcycle')}</option><option value="scooter">{t('contract.form.vehicle.scooter')}</option><option value="bike">{t('contract.form.vehicle.bicycle')}</option></select></div>
                        {!isBicycle && <div><label className="block text-xs font-medium mb-1">{t('contract.form.vehicleNumber')}</label><input type="text" name="vehicleNumber" value={formData.vehicleNumber || ''} onChange={handleChange} className={`${inputClass} uppercase`} required /></div>}
                        {!isBicycle && <div><label className="block text-xs font-medium mb-1">{t('contract.form.licenseNumber')}</label><input type="text" name="licenseNumber" value={formData.licenseNumber || ''} onChange={handleChange} className={`${inputClass} uppercase`} required /></div>}
                    </div>

                    <h2 className="text-lg font-bold mb-2 pt-2">{t('contract.doc_uploads')}</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.upload.aadhar')}</label><input type="file" name="aadhar" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className={fileClass} required /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.upload.pan')}</label><input type="file" name="pan" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className={fileClass} required /></div>
                        {!isBicycle && <div><label className="block text-xs font-medium mb-1">{t('contract.form.upload.license')}</label><input type="file" name="license" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className={fileClass} required /></div>}
                        {!isBicycle && <div><label className="block text-xs font-medium mb-1">{t('contract.form.upload.rc')}</label><input type="file" name="rc" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className={fileClass} required /></div>}
                        {!isBicycle && <div><label className="block text-xs font-medium mb-1">{t('contract.form.upload.insurance')}</label><input type="file" name="insurance" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className={fileClass} required /></div>}
                        {!isBicycle && <div><label className="block text-xs font-medium mb-1">{t('contract.form.upload.puc')}</label><input type="file" name="puc" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className={fileClass} required /></div>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.acceptanceDate')}</label><input type="date" name="acceptanceDate" value={formData.acceptanceDate || ''} className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50" readOnly /></div>
                        <div><label className="block text-xs font-medium mb-1">{t('contract.form.signedLocation')}</label><input type="text" name="signedLocation" value={formData.signedLocation || ''} className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50" readOnly /></div>
                    </div>

                    <div className="space-y-2 pt-2">
                        {!isBicycle && <div className="flex items-start"><input type="checkbox" name="hasLicense" checked={!!formData.hasLicense} onChange={handleChange} className="mt-0.5 h-4 w-4" required /><label className="ml-2 text-xs">{t('contract.form.check.license')}</label></div>}
                        {!isBicycle && <div className="flex items-start"><input type="checkbox" name="hasVehicleDocs" checked={!!formData.hasVehicleDocs} onChange={handleChange} className="mt-0.5 h-4 w-4" required /><label className="ml-2 text-xs">{t('contract.form.check.docs')}</label></div>}
                        <div className="flex items-start"><input type="checkbox" name="ownDocuments" checked={!!formData.ownDocuments} onChange={handleChange} className="mt-0.5 h-4 w-4" required /><label className="ml-2 text-xs">{t('contract.form.check.auth')}</label></div>
                        <div className="flex items-start"><input type="checkbox" name="agreeTerms" checked={!!formData.agreeTerms} onChange={handleChange} className="mt-0.5 h-4 w-4" required /><label className="ml-2 text-xs"><strong>{t('contract.form.check.agree')}</strong></label></div>
                    </div>

                    <button type="submit" className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 mt-3">{t('contract.submit')}</button>
                </form>
            </div>
        </div>
    );
}
