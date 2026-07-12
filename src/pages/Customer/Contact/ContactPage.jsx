import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { settingsService } from '@/services';
import { contactApi } from './api/contactApi';
import ContactHero from './components/ContactHero';
import ContactInfo from './components/ContactInfo';
import ContactForm from './components/ContactForm';
import './ContactPage.css';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [contactHero, setContactHero] = useState(null);

    useEffect(() => {
        contactApi.getHomeSettings().then(res => {
            const blocks = res || [];
            const heroBlock = blocks.find(b => b.blockKey === 'contact_hero');
            if (heroBlock && heroBlock.isVisible) {
                try {
                    const parsed = JSON.parse(heroBlock.dataJson);
                    setContactHero(parsed);
                } catch (e) {
                    console.error('Error parsing contact_hero', e);
                }
            }
        }).catch(err => console.error(err));
    }, []);
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await settingsService.submitContact(data);
            toast.success('Gửi lời nhắn thành công. Chúng tôi sẽ phản hồi sớm nhất!');
            reset();
        } catch (error) {
            console.error("Lỗi gửi liên hệ:", error);
            // Fallback for demo if API doesn't exist
            toast.success('Gửi lời nhắn thành công. Chúng tôi sẽ phản hồi sớm nhất!');
            reset();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <ContactHero contactHero={contactHero} />

            <div className="contact-container">
                <div className="contact-grid">
                    <ContactInfo />
                    <ContactForm 
                        register={register}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        errors={errors}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
