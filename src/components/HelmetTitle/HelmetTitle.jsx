import { Helmet } from 'react-helmet-async';

const HelmetTitle = ({ title = 'Bait Fusion' }) => (
    <Helmet>
        <title>{title} | Bait Fusion</title>
        <meta name="description" content={`${title} - Learn and share experiences with Bait Fusion, the community-driven learning platform.`} />
        <meta name="keywords" content="online courses, learning platform, teach online, course sharing platform" />
        <meta property="og:title" content={`${title} | Bait Fusion`} />
        <meta property="og:description" content="Join thousands learning and teaching together." />
    </Helmet>
);

export default HelmetTitle;