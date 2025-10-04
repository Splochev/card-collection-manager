import logo from '../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const SIZE_MAP = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
}

type LogoProps = {
    size?: 'small' | 'medium' | 'large';
};

const Logo = ({ size = 'small' }: LogoProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const basePath = '/' + location.pathname.split('/')[1];
    navigate(basePath);
    window.location.reload();
  };

  return (
    <img 
      src={logo} 
      alt="Logo" 
      className={SIZE_MAP[size]} 
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.8';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    />
  );
};

export default Logo;