let brandName = "Bait Fusion";

const courses = [
    {
        id: '1',
        title: 'High School Physics',
        author: 'Administrator',
        price: '$1',
        content: '<h1 style="text-align: center;color: #eee;">Introduction to Physics</h1><ul><li>Physics is a brunch of science that deals with properties of matter and energy and the relationship between them.</li><li>It also deals with measurment of quantities.</li><li>It also explains aspects such as diffusion, i.e. why objects fall towards the center of the earth, how light travels from the sun, eclipses, lightning and radio activity just to name a few.</li></ul>'
    },
    {
        id: '2',
        title: 'High School Mathematics',
        author: 'Administrator',
        price: '$2',
        content: '<h1 style="color: #eee;">Natural Numbers</h1><p>Are the ordinary counting numbers e.g. 1, 2, 3</p><h2>Place value and total value of numbers</h2><table><tr><td>B</td><td>HM</td><td>TM</td><td>M</td><td>HT</td><td>TT</td><td>TH</td><td>H</td><td>T</td><td>O</td></tr><tr><td>2</td><td>3</td><td>4</td><td>6</td><td>9</td><td>9</td><td>4</td><td>8</td><td>8</td><td>2</td></tr></table>'
    },
];

let headerRouteStr = [
    { id: 1, refStr: "home" },
    { id: 2, refStr: "courses" },
    { id: 3, refStr: "author-dashboard" }, // Optional: Add for authors
]

let footerRouteStr = [
    { id: 1, refStr: "about" },
    { id: 2, refStr: "contact" },
]

export default {
    brandName, courses, footerRouteStr, headerRouteStr
}