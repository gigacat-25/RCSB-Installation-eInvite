export interface PlantCare {
  slug: string;
  name: string;
  kannadaName: string;
  scientificName: string;
  commonNames: string;
  icon: string;
  sunlight: string;
  sunlightLevel: "full" | "partial" | "shade";
  water: string;
  waterLevel: "low" | "moderate" | "high";
  soil: string;
  fertilizer: string;
  pestControl: string;
  pruning: string;
  benefits: string[];
  description: string;
  careSummary: string;
  isSecret?: boolean;
  images: string[];
}

export const plantsData: PlantCare[] = [
  {
    slug: "tulsi",
    name: "Tulsi",
    kannadaName: "ತುಳಸಿ",
    scientificName: "Ocimum tenuiflorum",
    commonNames: "Holy Basil, Sacred Basil",
    icon: "🌿",
    sunlight: "Full sun (6–8 hours daily)",
    sunlightLevel: "full",
    water: "Moderate",
    waterLevel: "moderate",
    soil: "Rich, well-draining sandy loam potting mix (40% soil, 30% compost, 30% sand).",
    fertilizer: "Organic compost or vermicompost once every 3–4 weeks. Avoid chemical fertilizers.",
    pestControl: "Spray diluted neem oil every 10–15 days to control aphids, mealybugs, and spider mites.",
    pruning: "Pinch the growing tips and remove flower spikes regularly to promote bushier leaf growth.",
    benefits: [
      "Acts as a powerful adaptogen to relieve stress and anxiety.",
      "Supports respiratory health, helping cure coughs, colds, and sore throats.",
      "Boosts immunity with strong antioxidant and anti-inflammatory properties."
    ],
    description: "Revered as a sacred plant in India, Tulsi (Holy Basil) is known as the 'Queen of Herbs'. It holds a central place in traditional Ayurvedic medicine and is widely grown in households for its spiritual and therapeutic qualities.",
    careSummary: "Thrives in bright sunlight. Keep the soil moist but not soggy, and pinch the tips regularly to prevent flowering and keep it bushy.",
    images: [
      "https://images.openai.com/static-rsc-4/3WB8TBm_VhUZhs5yQnmeUcsvSSAEjWtXM1eYVF4ZmOHFu0_TF77kScOil6ao1C1oqPX7hoTOUD_1AESb0Ix-JRmgUu0ETOj0u-p9E1DSS-QknKW-L1P0a3HMmR60TGCpV7NlvQIKbJ3WluW-5RE-JuRlAIMTlEoVNeghCrsPoOvNsozvtgSJQcuK0Gr2qnSu?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/DPzaPP7jGR6gRq9WotE2t32zXYfcmfTXWpVXQ4VFpipUWQNw0jZXaG7aCOlbx6ceUrOTGK2LYxBtBjymauNcjjhiTfggKRr34PXcrI13KVZ4ZZ3cpqMJu0pau76LZY_VDjGRAkTIjgXg_hdh4PRrgYIfQthNEs_fivjEYkSDqmzFqAWn3JBkb2JmLHAdWhzm?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/6VYtGkYDGHC2YtevXJH2bDlds77JVh6vR_hia7AO7TodZp-lXsJzGUW9IfllV70BmDfSrcRixAht3nIMaUea5vjo-wZaHnFgeky95YtXYSnOJldHZp9ZptMcyU8pg3RLovBZC0Q-718e8g1vORleL9HahsiFuaAj0PRtav_E-YwI4N1NIpJaLWNozEQkJ5Zd?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/rKe7u5YZAhEii8KcX9_NjCEKJiU-noj_trYhdLZo-Wfk1bejeDHTUSowaqFi4EHBwsxCty1f7J9HyyHi2hxhJMZrTPwfPjdbLduJEZFf5QbrTdeKegEYA2NzWC9b7CN1xeHW0H80FjZJXCJR_BWVsQhFyqfOGa2m4KWM4qfaUBpDH5wu0wBfl1woJP01htKZ?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/SaQSTF3lv0xmHePEgTMD72yXcKgCHiQWeKjeU5eu7lWxwoIGsi4Uot9lq80OeaNvJmAezWDJRonodAbYfXQzi7B1TM2mUZg0dJUpWtPGUoAbo0cISH1Vu64_59AXfL-4ROYNCNr1C8FxbYqxgJWAo2LZjiskR3fxE55fLdR4jOZADH9nGDDzpzS5OpAAGxar?purpose=fullsize"
    ]
  },
  {
    slug: "dodpatre",
    name: "Dodpatre",
    kannadaName: "ದೊಡ್ಡಪತ್ರೆ",
    scientificName: "Coleus amboinicus",
    commonNames: "Indian Borage, Cuban Oregano, Karpuravalli",
    icon: "🍃",
    sunlight: "Partial shade to bright indirect light (loves morning sun)",
    sunlightLevel: "partial",
    water: "Low to moderate",
    waterLevel: "low",
    soil: "Fast-draining soil mix with high sand or perlite content to prevent water retention.",
    fertilizer: "Light feeding with organic compost once in 1–2 months. Extremely low feeder.",
    pestControl: "Rarely affected by pests due to aromatic essential oils. Keep dry to prevent rot.",
    pruning: "Trim leggy stems to keep the plant compact and encourage fresh, succulent leaf growth.",
    benefits: [
      "Provides rapid relief from common cold, throat congestion, and asthma.",
      "Aids in digestion and cures stomach bloating, especially in infants and young children.",
      "Soothes skin irritations, insect bites, and minor burns when applied as a paste."
    ],
    description: "Dodpatre is a perennial succulent herb with thick, highly aromatic, and velvety leaves. It is widely grown in South Indian households as a go-to remedy for pediatric respiratory issues and indigestion.",
    careSummary: "Treat it like a semi-succulent. Water only when the topsoil is completely dry and protect it from afternoon heat and waterlogging.",
    images: [
      "https://images.openai.com/static-rsc-4/VRH7fTUyXOIAdf2LbAHPCtcRjdsICSW-kQwIuWTeS3tXqlm7qCQaokGxJd5TXJzD2EsVotZjIGmng9y2QqiAZb0vHhrx06KdQ56aORqn4uJcp14TOP2gBJfoiZVxADUfLKY9kPRporMYs8aoaaMaYlujtqsUEvEDJLXYJXFpx5B29zOar5iuTO2CTRFGaMbs?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/XmtLlNse7hxMFAzFlsgW5FFQWvjR4QBZqQI7p4boS_GPGD3LxGvp5FdButyWZLKSVGk4fsyUG3tBSjifat682KhoZnEm1JMJu5yOe3NXG46xQqYDe0ZuvPNLrjTJGO2GXJNvNwPzGWI9r8V2AewbCc6Vzt1uOJ8L6FgiMvdIl7uNPl4Fq_8yTqeg56mgvrUo?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/j9Eiz85gVJ72-om_yxQQnLAVbZc0RO4hni8XlKflz-FEUDIyv-EBXgImYVk0I83KYt5DBJEci42HMODg71SP0L_UQ9kyMpw2vj8OawUy9LuCWIpnZ4pNgkTeokLHoEbbLhVm3qjqaS4h96FPSutiVC2Y-kcIOpiNnXncSp8yDQpfy6vMIA0oMzXaGfxWA5h4?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/-Vj8WJ51pfobPD1YHCrMBq2ZpFF6aEoiBjs6hy5RNOdhRJIb08JIxiIZvtY0WCf_4WZDDtHl7dHM-Ww7rKU7RKEFd2juzMX9XtrCTRbb6xEBKyAMZF6TteeSkcYoudYXdG93tgvaZ4Umw-RFei-2lnjSgl-1VvTJAdoH3cXNby4sWg0g1p-V_CrPM6guyGD-?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/9lZ2BYYD18A7KAwZZe9wTf8w2iBagcsT_e0B7zv8EPNJMJMHUvFl6QxQTPh8zUuTAE5MuGD-zHt7Gk4WA4K4y7FFADEYF7ocS1WXm4GS1UvKpEqc0_TDwh_eaBdQS2IP6nIGGEKnwWyqz8-JnDP3LbztFUGlRnOkqgssSoQ8OT6WH6Y6IJksDnXxCKZ2CHRs?purpose=fullsize"
    ]
  },
  {
    slug: "brami",
    name: "Brami",
    kannadaName: "ಬ್ರಾಹ್ಮಿ",
    scientificName: "Bacopa monnieri",
    commonNames: "Brahmi, Water Hyssop, Herb of Grace",
    icon: "🌱",
    sunlight: "Partial shade to full sun",
    sunlightLevel: "partial",
    water: "High",
    waterLevel: "high",
    soil: "Heavy, moisture-retentive clayey or loamy soil. Can grow in shallow water.",
    fertilizer: "Feed with well-decomposed liquid compost every 3 weeks to support lush green runner growth.",
    pestControl: "Check for caterpillars. Use biological controls or hand-pick pests. Avoid harsh sprays.",
    pruning: "Trim runners if they spread beyond their boundaries. Pruning encourages dense matting.",
    benefits: [
      "Improves memory, concentration, and cognitive functions.",
      "Reduces stress, cortisol levels, and anxiety while promoting calm sleep.",
      "Rich in powerful antioxidants that protect cells from free radical damage."
    ],
    description: "Brahmi is a creeping, succulent marsh herb that naturally grows in wetlands. Renowned in Ayurveda as a 'Medhya Rasayana' (brain tonic), it is highly valued for enhancing memory, focus, and overall brain health.",
    careSummary: "This plant loves moisture! Keep the soil muddy and consistently wet. It thrives in humid conditions and bright, partial sunlight.",
    images: [
      "https://images.openai.com/static-rsc-4/KAsPiAEbJtMAp3y4KtYYY-xJPIdCeBZSr98zntCualccP3c7ZSiThk-dThEIcyzOa5Rx2g0dX4a3Onoh6fX0HKI8MgEWPWqiMej_vmFcsOuN6nBY_t4a33lstdfKqw_9SAlc8n4hMjiBjbzCjroSDVWkPDAo0evhMb60HKOihliOw-OmS9rR346nuzsV_emX?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/E-pYW5HrZiBTajwyN6UvwBtoNeIXKVemKOYU9bar3AFPIF6NMAX3o6klIkk3GjEo5_VBOMFVG-OVhZdIdKgXLjLwPJmILaGOAKgDB33Chg-ksqh4k585m9zv7odihhGToxCB_pWNUkf8iuB4RHXQzZUS5ssVeZmBaEvyJYFj4qE_RRq0KxBzOt3qh3d1muhY?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/SbPK6SPKsRswKOf4-AcKhtJsknpc5XEgQAqFWdmu9AJ1w6MbxJTcpCZZMheVRkzwPdJcJ2t-HsMHKb3dAb1cez2Pg3ZRk9jVbVk0LrsT70_KL-ljrW4q1ZTwaae1eK2R0Q1QAaQRYDPdhVklgL6i67EsAt_z2fEP2MWf_n1RYylzsXEvYbO7xFuAd2L2112r?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/n_n5V2AZji4KIkcUqyXKIRektMxyFQkJ86JIGeDsXZBY_V8LKNZkiG-rnajyW7n9OozTJ9HiPWzTu7r98VjT5GCVg9XuY0X_3yPnuvdTUSSq4Ky2sJ5lQHbE_ulf036WmeiobKEepQOD9u7LCQ9wuLF7jueyJnysG_LIUS_c08aMV3ddpcZ3UOPlwQjgPc2J?purpose=fullsize"
    ]
  },
  {
    slug: "mexican-mint",
    name: "Mexican Mint",
    kannadaName: "ಮೆಕ್ಸಿಕನ್ ಮಿಂಟ್",
    scientificName: "Plectranthus amboinicus",
    commonNames: "Spanish Thyme, Karpuravalli, Broadleaf Thyme",
    icon: "🌿",
    sunlight: "Bright indirect sunlight or partial shade",
    sunlightLevel: "partial",
    water: "Moderate",
    waterLevel: "moderate",
    soil: "Well-aerated potting mix containing 30% sand or perlite for quick drainage.",
    fertilizer: "Apply vermicompost once every 4–6 weeks during the active growing season.",
    pestControl: "Wash away occasional mealybugs with a strong spray of water or diluted neem soap.",
    pruning: "Pinch off the top growth tips regularly to prevent trailing stems from becoming leggy.",
    benefits: [
      "Helps clear congestion and relieves dry coughs and sore throats.",
      "Possesses antimicrobial properties that help fight infections.",
      "Used in culinary dishes as a savory herb and spice for seasoning."
    ],
    description: "Mexican Mint is an aromatic herb with thick, fuzzy leaves and a strong, oregano-like fragrance. While similar to Dodpatre, it represents unique broadleaf varieties popular in culinary and herbal tea infusions across the world.",
    careSummary: "Place in indirect bright light, water only when the top few centimeters of soil feel dry, and prune regularly to maintain a bushy shape.",
    images: [
      "https://images.openai.com/static-rsc-4/mqUhUYxbRijTnMp0fF2pk7yHm7al_dBf_nMkrZO2zag9WDwv4Q2GDdT0mXxraGe5_kEUUGSP3L5wdIfMiXWuqf70fyRXqC3m0AE3z36TFBFiKwxt7jPwtKXCS6O4hv3OOpn7lO9NDvLpNP7_2b1XYYX4fmsL1-AeJilB6sLPBj2GhygY9nYzscF07gRa6Wq7?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/wwyGS7mX6VkJvbR3srBkXgAFII-NVpyyuFhMUVbmP33R6urxfgKFZ5vYDFtVo95klX5KbpJvLPZ3CmMz-VBDdcw9bbTmeqepXbUpRhOyFwZp4dj2XUQRS4RPUnNlxjs-0RYzSz6t3O2ss7wEhEFcHe86k9r2ZLS15tOACoKOdN0VuswSsXHCrreUNSPZsSXA?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/Pk33BIzg7AaXmRX5UhTSuC2cCONBbNKtAmFXjyI-Wz5UHqFU9Xg0Zo5ESAlaaIhCHh3g3gBhhIWMRiQzA9tgDEevlznR_vvrp1aGCnZX41lJHdzMRIV9TtAJu079583OLFUSw-YYalNek09Eb2YygUO4VYp-MBdwQuj4d4n6ROuTVM-5HuwrFauRVPd9Jrvy?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/3vuQR2w5gndbmpYqIk7-8qgbnIptoMtCUtjWNW96eRyAMHGX8MKVU9AobqyLA5DNiPPg5w_iVTiHBaDdgY97KT7TrhVjJ1VGUv6jnN4RLgpmqYHZ0Y9g17KWP3abs5FkiZnqMNiBCSSLGePYwevkktcmKX1J4Z38CuqQvHsFosbbxrfEbH10MJHcfqs4K_0T?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/epCTurTkYDk3sXHuita7WCyw5r4pvaea0Wwdwmux8Ohz6kwT8WmRmh7UApd1nidSF62gV_QhOKMIwyI5DlXzLO009tOoWckGieoN_5SB8FYbWO3pbzYBiH_mfuKT-6mVacIgW16NYTRjpWZ2zyWrV_SYOEa-BoicmwERHw5C67C6U9YEXn7Yu_GBWlfkEi02?purpose=fullsize"
    ]
  },
  {
    slug: "holemathi",
    name: "Holemathi",
    kannadaName: "ಹೊಳೆಮತ್ತಿ",
    scientificName: "Terminalia arjuna",
    commonNames: "Arjuna Tree, Holematthi",
    icon: "🌳",
    sunlight: "Full sun",
    sunlightLevel: "full",
    water: "Moderate to high",
    waterLevel: "moderate",
    soil: "Deep, moist, fertile alluvial loam. Prefers clayey soils with constant moisture.",
    fertilizer: "Apply organic manure or compost twice a year (before monsoon and in spring).",
    pestControl: "Keep the area around the base clean. Watch for bark borers or fungal leaf spots.",
    pruning: "Prune dead or overlapping branches during the dormant winter season to guide structure.",
    benefits: [
      "Acts as a powerful cardiotonic, strengthening heart muscles and improving cardiovascular health.",
      "Helps regulate blood pressure and keeps cholesterol levels in check.",
      "Speeds up the healing process of fractures and bone injuries when taken traditionally."
    ],
    description: "Holemathi (Arjuna) is a majestic tree that grows abundantly along stream banks and riversides in Central and Southern India. Its red-colored bark is legendary in Ayurveda for its profound heart-protective and strengthening properties.",
    careSummary: "If grown in a container, use a large pot with moist, organic-rich soil. Provide full sun and water regularly to mimic its riverbank habitat.",
    images: [
      "https://images.openai.com/static-rsc-4/g6Chi8qyqecsFOhSUfyqEf0LdATtH_wuSqVgl1eMSt_YCUajypcYGTCZLHrsJmshRw2qOJtlByeYOfFkyWrXCEIA1FEvsa2unki1CfoSARKz1vllauy3mt8sBYVYvAb535C57svXSAGkdsR9pb_PHvgxI1NW2vw0AU00IecCnDR6-FKljHAdicaxg9z38Q1x?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/xaezYhi6Km1ItX6-GluLsCWaglyA543Fmh6tvSHn5qtfL9hVUvgW9vxuZMM7a3cCPqC803AfJkKkwPWM8bi5HXYRTNQdBapjglwjGTRgKiWXeJCuQu5xph74OpsuJvz494KX5CBE7ufT8EfkLBPhQY_FkR4BDQyoHXMO006SCgFSrYbZ8xfPGU2Hs2Fe1ZQ3?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/UaTN2chbamWfU4ESbDJeqcBXkS9nwhMIULPVVkX43KofcTuq8c41hyK5aciloa9odUProKDPB14-DMim1RKbKHHtdfJnI2K0soSZ9weRQf2emL_I6d0DXEqHN1uGJvvrFznwfvSkf7QyDnCUNu9y64xVY_z0vZWNjm_ljO4CCtpMq6ugAoBEV-WZSQGM9qqD?purpose=fullsize"
    ]
  },
  {
    slug: "lemon-grass",
    name: "Lemon Grass",
    kannadaName: "ನಿಂಬೆ ಹುಲ್ಲು",
    scientificName: "Cymbopogon citratus",
    commonNames: "Lemongrass, Fever Grass",
    icon: "🌾",
    sunlight: "Full sun (6+ hours daily)",
    sunlightLevel: "full",
    water: "Moderate",
    waterLevel: "moderate",
    soil: "Well-drained loamy soil. Does not tolerate standing water or heavy clay.",
    fertilizer: "High nitrogen organic fertilizer (like compost tea) once every 3 weeks for lush green blades.",
    pestControl: "Naturally pest-resistant due to high citronella oil content. Snails may occasionally chew leaves.",
    pruning: "Cut back old, brown grass clumps to 3–4 inches above the soil level in late winter to refresh growth.",
    benefits: [
      "Improves digestion, relieves bloating, and prevents stomach cramps.",
      "Aids in detoxification, flushing out toxins and uric acid from the body.",
      "Fights flu, colds, and fevers with its anti-microbial and cooling properties."
    ],
    description: "Lemongrass is a tall, tropical clumping grass with a refreshing, citrusy aroma. It is widely grown for culinary uses (teas, soups) and for its highly therapeutic essential oil which contains citral.",
    careSummary: "Provide full sun and water whenever the soil surface feels dry. Trim the leaves regularly to harvest and keep the plant neat.",
    images: [
      "https://images.openai.com/static-rsc-4/D5bOc2YUsTOSFZ3NO8N-7vAGHjC1JkR-xWObR5AAbBikENTXjymE0_e7cSnyWfkfbrQqEcTVPbWWMRD3EePFn9CP4Sghb00MfJOSS_wInJkLHz95j8mGFELbF-wsLDjJlDiu20HrHNBMpk_O7D65imCXifCQ5vY_9EAc6YkH6JY_wtA6Qg_WIT7QuNR0gj2D?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/QFK1B61g1rfxsNRKH_vGZ1sCiqggws-v01cWf33q3ikpY1DDk-5lrSW6R2v4J2HC86tU_DA5aLia8hc4Z0NM5RjyWlsWWkSq40r-htbVTQfvRR2PTycDxYnzU2C8U1yQOaCpiK-lnydNedcazQAzi-7WxRDdpr4xgfYhUdg0Rw2oZQaKiF2b_xdo5gTX1EvJ?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/3_eJyuWYtRM-xUAEVKMBgEManrtNVq3b3g7Ffmwk9yqR5_mJ8KoRdxNx9L1te8MNmDLXyadUjdpPwjpxBAEgjBtkWC7bq4XzkHgPRahBI22jeRZY2G4ftFkq5KpVDBa5_-xcePY5RiYs32EWZBs4p0wx7i5ls4FZGK-xeugfavqOx9ITOZW3gyNBXAHkNGyi?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/s7Idt-o_WGMyRkkFQliGjukg4z1HbrlMnAECFDm053SZ56XYfiJGTMRwnYwutAVzzTeZajNBRHRLo-Gy_tA6BOZ1JmRgH71A17c7jxT2VzLe3OnxUa3Y9eI_bwx_qssym3d5Ng8DH73KeYykft3QiWVI_NxaYgvZ-i59J-eGHMc5GHoaT_iP2nnGYt8p2bqZ?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/Ylm12MtPIE-Qe-CUP7lhQKGBSQAgq_BGCfUHbYl8azxL5zxgys4qjxv10dXYL2OJWoP1lLcOe5vgNz3OAw4wL_sp5UQVQyMoggYbEeslVnC4NJEpQGmDIPplC4Noxj2N-TEbcI9oMMAzmFNge9rjj1zqEJzPBLyVPoN8iEr3irYmch2hv0cyceVaJ0XC1bIV?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/UnpgFQT8umBSOpAvcJZ4Mu3Wbak_iiHRmz-7dKfHyL7kCZW_Ulduy9WRmSqJaCyWSlg1SbnZCcEhQy2ENGQW6Gvu5EElxmfZZsy8lZWFAt3dL26MgJoxMzoXPF4IjvHJ10SLxOoQJ9ff32N5ysYz_qwiuwyd4F_4ucZLXVNLm7E0KJ74VR_ZhT2QgjTo1WPl?purpose=fullsize"
    ]
  },
  {
    slug: "insulin",
    name: "Insulin Plant",
    kannadaName: "ಇನ್ಸುಲಿನ್ ಗಿಡ",
    scientificName: "Chamaecostus cuspidatus",
    commonNames: "Fiery Costus, Spiral Flag",
    icon: "🌿",
    sunlight: "Bright indirect sunlight or partial shade",
    sunlightLevel: "partial",
    water: "Regular",
    waterLevel: "moderate",
    soil: "Rich, moist, loamy soil with plenty of organic compost and cocopeat to retain moisture.",
    fertilizer: "Apply well-decomposed organic manure or leaf compost once a month.",
    pestControl: "Watch out for leaf caterpillars. Hand-pick them or spray diluted soap/neem mix.",
    pruning: "Trim dry leaves and cut down old flowering stems at the base to encourage new offsets.",
    benefits: [
      "Chewing one fresh leaf daily helps lower and manage blood glucose levels in diabetes.",
      "Provides relief from asthma, bronchitis, and other chest ailments.",
      "Acts as a natural diuretic and prevents kidney stone formation."
    ],
    description: "The Insulin Plant is a beautiful tropical herbaceous plant with spiral green leaves and vibrant orange flowers. It earned its common name because chewing its sour leaves has been shown to assist in blood sugar regulation.",
    careSummary: "Keep in partial shade where it gets morning sun. The soil must remain consistently moist. Feed monthly to encourage lush green leaves.",
    images: [
      "https://images.openai.com/static-rsc-4/o2LqnyASttfmlEwZdRSSkSwVFaawmrW8MlR8ZSwSQtpdrO-_45a4Lp238YPiIH3DnzDH-Y9kdV06vTrQKBC2sqsePkw_xSEPgHlmmZlOYLrs8DtRGW0HjPzfdC39FWR9JKR-NJ6oHTNXTKu8tSeSzvj3emN0tgZALqvZ2S_5ZnJW3DmDWI0sOeSuU2lhzMMh?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/5KOBuQXc5NvGCSG9vTgXsW5Xgik-FHdgzNyp4OTwDHZOnZcj8CfpIQl3om3nn2UqhtCG02QkUwXqHqMRzxsUmMK4HAPXLqv7Eo4YMdLden0i_98jlB1z_mMU88PLXeqYalezsbb5w4jvPA61_IJD-vkAdoMYlAWCkV-MudYF62yOxUIhJqmmO7qxWb3UHy_l?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/mpE5yh7k5EVcltMHnccm9_CAmo0LDLIF8tWNXAgNgERK7YSqpaZcY4ejJpF7mfo4PSfHsatTmtbTy_axMJym2kAi0JCEw7DqkjIixiBo6NOp7amHSqOXTS9KKAMRcG0x1rKT-FZit20V_1wFfCVYf4mvc1L_2F5lZzEgZGCRdOQIYhl5wLdKl2_v2s4Wn29x?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/JFxLMbMFiZqdgm03OJcepe1CQgql_6voQ08z21Eh_5qy7Au2F9JFe1AYpsx9aXSTpzQpnQ0HlRO1eyuq1A7ui9rdylHfzRIUos4hjBuGVmkwc6AwfJlPBjnbLQphomlQgQ_lV-C9uxQfNrtLfqTFWX45U58M9IRF4-Pd1-mW1CHQmn5Imb_OXAcMhewPApMv?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/Olhr0Fhgzvanp33Um0x_qiyKLcSYul7gG7LBYj5sU-vtxbptAboZa9fWG0sUOh5MsSIiRxCmli_xtKUDlaz_h0XkF2hOO4ZHLXsAWUyZ49Y5keq0TSTDiMXzv8BCouPy73jCdkpPy0Y9HKOUlzAONsAkPMTEqxmreU7mqO4EHAKqnrSO8W06zOi0rMs3VahR?purpose=fullsize"
    ]
  },
  {
    slug: "amurth-balli",
    name: "Amurth Balli",
    kannadaName: "ಅಮೃತ ಬಳ್ಳಿ",
    scientificName: "Tinospora cordifolia",
    commonNames: "Giloy, Guduchi, Heart-leaved Moonseed",
    icon: "🌱",
    sunlight: "Full sun to partial shade",
    sunlightLevel: "full",
    water: "Moderate (highly drought-tolerant once established)",
    waterLevel: "moderate",
    soil: "Sandy, well-draining soil mixed with compost. Avoid heavy clay that holds water.",
    fertilizer: "Needs very little feeding. A small handful of compost once in 2 months is sufficient.",
    pestControl: "Rarely attacked by pests. Avoid overwatering to prevent root rot or mildew.",
    pruning: "Prune regularly to control its trailing size and direct the vine along its support structure.",
    benefits: [
      "Supercharges the immune system and acts as a powerful rejuvenator (Rasayana).",
      "Eases chronic fevers, viral infections, and controls inflammatory responses.",
      "Aids in managing blood sugar levels and purifies the blood naturally."
    ],
    description: "Amurth Balli is a vigorous climbing deciduous vine with characteristic heart-shaped leaves. Revered in Ayurveda as 'Amrita' (the root of immortality), it is a legendary adaptogen and immune-modulator.",
    careSummary: "This is a climbing vine—it needs a trellis, wall, or tree to climb. Water moderately, let it climb, and give it plenty of bright sunlight.",
    images: [
      "https://images.openai.com/static-rsc-4/uuapxEz0cbvtgrUq0DVZHYW-MnRJuhiieC5HbZDAp7xPyzLvm198t8mlUGOF2mnGx6swjtao2AOew2OJBvh0leyZpj5wCFtT2yYto_5L6pCEFe2O7JCL5QNPA1mJo1M90qEOQ_mpszeLWG0NfhYIUs9cQYFZygi6FMWMv7jVeY5fGUgKPJHQHtH6NpcP2qhD?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/D82oFUUClurKp6rfInWHPu8fBnqMmw44wUTFoCArxoTBV0RWdan_4FDFJCbdbDVDyQzTNgvG9mGuzbshzbexSiPY-Pnalz3L2HIkhr5UKtU-ayTSvPEPQPmTQRFNtFDxHJH7t98bHKmhZpaDf1C8nSO3IjygHr8WYKFefaMcjlhbJe6O5PyEe2aFtXORiVVl?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/wp2M-6LIRktgbmDDFBUlFRcK17bj0sSzYwUW6x6O9czUfhe19T8uDyfWu2-wda_iO4v2oVrxaSHgsYIQNd2wVcDOxQVEgUNapFjmpbCXpz04jud0IPnS532j_lUywKc9p5pi1K4ekWGz4oC7qZ83UJVT-dd4HGyZ_NCF-BpBNos6Pqicb7_wOBpaNpHPy1J-?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/J5zGFmMcPlO3Q4qNutcbex7AICDuHhmkhN0xyIZhZ8bav-e8JMKVzz8pctTPCIe8luO_4WUzHPf1RnnxWIqjxv9DAUvwIa3C5Sz_zr3kGiF8JMYD1r790puL3JZ0KJdLByU2aYt1nMjxc4MOgzP5_6LSKTbMdqLRWIM51_zvYn-DPalHEwa5CezOOQpFX-zi?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/PCEGAkrXiyzXLb-6DG8JgGPHDWUiRhRCI-DCuDVKjEXLMVCP3fgSIe3WbOiw6EVBIsSSt6Eu0FirsOpfYWoK1JroWCEUKlOGEywE2Y80MA73ZhxWyouKWNzxbQYPKyiIj1hXabsWC6gCShPQrZAtcnHwdU7oP9DyHND99epyMDwtUreGjzxJFUoQ41VA23it?purpose=fullsize"
    ]
  },
  {
    slug: "kadu-basle",
    name: "Kadu Basle",
    kannadaName: "ಕಾಡು ಬಸಳೆ",
    scientificName: "Ceylon Spinach / Basella rubra",
    commonNames: "Wild Malabar Spinach, Talinum Fruticosum, Fameflower",
    icon: "🥬",
    sunlight: "Full sun to partial shade",
    sunlightLevel: "full",
    water: "Regular",
    waterLevel: "high",
    soil: "Rich, fertile, organic-heavy soil. Add cocopeat to maintain constant soil moisture.",
    fertilizer: "Apply vermicompost or composted cow manure every 3 weeks to support rapid leaf production.",
    pestControl: "Snails and slugs love the juicy leaves. Protect the base with eggshells or gravel.",
    pruning: "Harvest the leaf tips regularly to encourage lateral branching and tender, juicy leaves.",
    benefits: [
      "Highly rich in vitamins A, C, iron, calcium, and dietary fibers.",
      "Has a cooling, soothing effect on the body and helps relieve constipation.",
      "Helps treat mouth ulcers and protects the digestive tract."
    ],
    description: "Kadu Basle is a fast-growing, succulent leafy vegetable. Often found growing wild, it produces thick, fleshy leaves and is cooked as a highly nutritious greens dish. It is prized for its cooling properties.",
    careSummary: "Keep in a sunny spot, water frequently to ensure the soil remains moist, and harvest the growing tips regularly to keep it producing succulent leaves.",
    images: [
      "https://images.openai.com/static-rsc-4/QNv6-_6v6lFdnugOEhSYWdhttr2YILyHKfrIgcHpL9WCrS-Xj-h9vkvIkbcqKjX7g2JeXd_RgfUycd9PaDQgsts12TEwQjYjhe2plrjvvspqY8OVO3YEoQBvtXubjZTpb7KKcq-kWOeFryqhOgcrzYhxgU2AWKjwhOCHTEgGrzKMj3j4iYasoJ4yjaygx4Cr?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/gCVLQ9HHtqMf0BhwvTRDD9jm938BBxEPnfhvl0AZ_AxYmQr16ePQiQ_8kHB4T_TIn0rgdk0-QczlpzY51i_ibGJBk3Qv9m6cXxTRvla3iV9icxz4A7k5z3bhMi6iBTHCnk-vWxg0b6hHa7UJGS3j-D_rZyk3xB74oxdceN-HwhtHvI7irx_N0-z-SPDLnKCU?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/WP90VL_evTds27tOKD50vOPc3pRCdmHcrIiDYkk7cQ00u8HcKcr1jrQzxL_UafBrvT6Fm1v65L60vawKko6MRbc5g8IN8hMsOZj9VjLpjLQIlFMFMr7oYDdnIHKk69v89jKieFMVi28BXN66C3NHckfAvca6lco2NUnuNly616z9RjlyIztzbdpDwoFqytOB?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/91VzZE6N5Mad39hbclBqD68rQ2Mf8HjYPNX3BW95c7BUI3s5ZLvnzXZ7ug1dZK4wZFGnVfJE5xPGnufvvzCNclZLH4ILhlkSXxC_DwAsX32NxfMbBjSOpper0HGUoP1w8Lo1A3sk7n-slqbqBugC17fZ17EgVXNLjM7PERwBvvE7vR-1_817NzsNOdCySTJp?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/_B31kkXw7aIZEjOH5bFaCwpaCO-KGYEcwblBCRJv28dINnQ2dFQqRZ3yyWwsSgt6ovnqC6AQ0ssxKi-1t6KxmbQh-F-pCLNheCKaCz75BbQfJ0o0bvYvXhUzLun98M4QBtBZv0l0WZuMhB1XSXhUlOjD8NtnaAEzlbtqUiMSgpuHQLsbfzQY2IcwfkCMSBy8?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/9PLwBmJ48vQrrt4jULShYPppj6sKqnTQ1pt-vqW4qfPIKDs2ou6aVgvTBsz9hniliVYu--WMtGheRODP1iKy6Jb9WN9k-GZ8OvTF4nquva4aHaFsO-x62DhJiF_aeMGT8Ck68VJGYWudM7npxcvC01YNK_J65BZNKZmOhVKHURJJzogrxJXrk8m3ayNDESsU?purpose=fullsize"
    ]
  }
];
