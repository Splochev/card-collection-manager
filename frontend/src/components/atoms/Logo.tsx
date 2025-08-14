import logo from '../../assets/logo.png';

const SIZE_MAP = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
}

type LogoProps = {
    size?: 'small' | 'medium' | 'large';
};

const Logo = ({ size = 'small' }: LogoProps) => {
  return <img src={logo} alt="Logo" className={SIZE_MAP[size]} />;
};

export default Logo;