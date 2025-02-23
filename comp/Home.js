import { useTranslation } from 'react-i18next';
const Home = () => {
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div>
        </div>
    );
};

export default Home;