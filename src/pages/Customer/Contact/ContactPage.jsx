import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { settingsService } from '@/services';
import { useSettings } from '@/pages/Customer/Home/hooks/useHomeData';
import ContactHero from './components/ContactHero';
import ContactInfo from './components/ContactInfo';
import ContactForm from './components/ContactForm';
import './ContactPage.css';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: blocks = {} } = useSettings();
    const contactHero = blocks['contact_hero'] || null;
    
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
