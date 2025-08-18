'use client';

import BlogPageHeader from './BlogPageHeader';
import BlogFeaturedImage from './BlogFeaturedImage';
import BlogMainWrapper from './BlogMainWrapper';
import BlogRelatedArticles from './BlogRelatedArticles';

interface BlogDetailsPageProps {
  slug: string;
}

// Mock data - in a real app, this would come from an API or CMS
const getMockBlogPost = (slug: string) => {
  return {
    id: slug,
    title: "The Anti-Outside Guide: For When You're Done With People, But Still Want Soft Life",
    excerpt: "Let's get this straight: in Lagos, \"outside\" doesn't always have to mean a carnival of activity. We say \"we're outside\" and it's parties, clubs, concerts, link-ups, and all those high-energy, people-filled activities that drain your battery faster than scrolling through Instagram.",
    content: `
      <p>And while everyone else is shouting "outside dey!" you might just be whispering, "not me, not today." But that doesn't mean you're ready to give up on the soft life. You still want aesthetics, ease, and fresh air. You just want it quietly, on your own terms, without the pressure to gist, or "where you dey?" your way through the weekend.</p>
      
      <p>&nbsp;</p>
      
      <p>This guide is for you: Lagos spots that give outside energy without the crowd. Vibes, not noise. Beauty, not bustle. Here's how to step out… softly.</p>
      
      <div style="padding: 36px 0 20px;">
        <h2 style="font-family: 'Inter:Semi_Bold', sans-serif; font-weight: 600; font-size: 24px; line-height: 36px; color: #13151a; letter-spacing: -0.48px; margin: 0;">1. Go Read or People-Watch at a Quiet Café</h2>
      </div>
      
      <p>Not every "outing" has to include a DJ set and a stranger asking for your Snapchat. Slide into <a href="#" style="color: #fb7102; text-decoration: underline;">My Coffee Lagos</a>, <a href="#" style="color: #fb7102; text-decoration: underline;">Art Café</a>, or <a href="#" style="color: #fb7102; text-decoration: underline;">Eric Kayser</a>, <a href="#" style="color: #fb7102; text-decoration: underline;">Maishaiya</a>, grab something iced, and post up in a corner. Whether you're reading, journaling, or just watching Lagos pass you by—this is outside without the Outside.</p>
      
      <p>&nbsp;</p>
      
      <p><em>Headphones on, even if nothing's playing. It's the universal "please don't talk to me."</em></p>
      
      <div style="padding: 36px 0 20px;">
        <h2 style="font-family: 'Inter:Semi_Bold', sans-serif; font-weight: 600; font-size: 24px; line-height: 36px; color: #13151a; letter-spacing: -0.48px; margin: 0;">2. Explore John Randle Centre or Nike Art Gallery</h2>
      </div>
      
      <p>Zero crowds. Zero bass boost. Just walls filled with culture and colours. You're outside, but in a quiet, contemplative way. Take your time, get lost in the details, and maybe catch some creative inspiration.</p>
      
      <p>&nbsp;</p>
      
      <p><em>A solo stroll through an art gallery >>> shouting over club speakers.</em></p>
      
      <div style="padding: 36px 0 20px;">
        <h2 style="font-family: 'Inter:Semi_Bold', sans-serif; font-weight: 600; font-size: 24px; line-height: 36px; color: #13151a; letter-spacing: -0.48px; margin: 0;">3. Take Yourself to the Movies (Yes, Alone)</h2>
      </div>
      
      <p>Who said you need a date to catch a film? Cinemas like <a href="#" style="color: #fb7102; text-decoration: underline;">Filmhouse</a>, <a href="#" style="color: #fb7102; text-decoration: underline;">Genesis</a>, or <a href="#" style="color: #fb7102; text-decoration: underline;">EbonyLife</a> are perfect for when you want entertainment without interaction. Just you, popcorn, and a plot twist.</p>
      
      <p>&nbsp;</p>
      
      <p><em>No one can hijack your armrest when you're flying solo.</em></p>
      
      <div style="padding: 36px 0 20px;">
        <h2 style="font-family: 'Inter:Semi_Bold', sans-serif; font-weight: 600; font-size: 24px; line-height: 36px; color: #13151a; letter-spacing: -0.48px; margin: 0;">Final Word:</h2>
      </div>
      
      <p>Just because you're not outside-outside, doesn't mean you can't enjoy being out. You can be soft, solo, and silent and still soak in the best of Lagos. So when they text, "You dey come out tonight?" feel free to reply:</p>
      
      <p><br><em>"I'm outside… just not that kind of outside."</em></p>
    `,
    featuredImage: "http://localhost:3845/assets/0a93470acdd29c87aed803716725923a770ad82e.png",
    author: {
      name: "Adunni Olorunnisola",
      avatar: "http://localhost:3845/assets/774d08f3793ed7c4cbd8d6c425263d9aaf4b94e5.png",
      bio: "Adeola is a Lagos-based lifestyle writer and wellness advocate. Passionate about helping people navigate city life while maintaining their sanity and sense of self."
    },
    date: "Jul 5, 2025",
    readTime: "5",
    tags: ["burnout", "wellness", "algos-life", "productivity", "mental-health", "work-life-balance"]
  };
};

const getMockRelatedArticles = () => {
  return [
    {
      id: "new-restaurants-lounges",
      title: "10 New Restaurants and Lounges in Lagos (Dec 2024 – Mar 2025)",
      excerpt: "As we enter the second quarter of the year, it's time to spotlight the freshest additions to the…",
      date: "Apr 11, 2025",
      readTime: "5",
      image: "http://localhost:3845/assets/2acc2e0ab71f20523acc61b38dcb8e0400dfd328.png",
      slug: "new-restaurants-lounges"
    },
    {
      id: "top-parks-picnic",
      title: "Top 5 Parks in Lagos to Host your Next Picnic",
      excerpt: "Summer is here again and it's the perfect time to dust out those blankets and bring out those picnic baskets. Picnics are one of the best ways to enjoy quality time with family,",
      date: "Jul 07, 2023",
      readTime: "5",
      image: "http://localhost:3845/assets/025cad4e08b390897ab6f3828408951e81f4a953.png",
      slug: "top-parks-picnic"
    },
    {
      id: "rooftop-spots-views",
      title: "Rooftop Spots with the Best Views in Lagos",
      excerpt: "Let's get this straight: in Lagos, \"outside\" doesn't always have to mean a carnival of activity. We say \"we're outside\" and it's parties, clubs, concerts, link-ups, and all those high-energy, people-filled activities that drain your battery faster than scrolling through Instagram.",
      date: "Jul 02, 2025",
      readTime: "5",
      image: "http://localhost:3845/assets/ce27825c9dd95d54db872947f341e976cc1e4034.png",
      slug: "rooftop-spots-views"
    }
  ];
};

export default function BlogDetailsPage({ slug }: BlogDetailsPageProps) {
  const blogPost = getMockBlogPost(slug);
  const relatedArticles = getMockRelatedArticles();

  const handleLike = () => {
    console.log('Like clicked');
  };

  const handleSave = () => {
    console.log('Save clicked');
  };

  const handleShare = () => {
    console.log('Share clicked');
  };


  return (
    <div className="min-h-screen bg-white">
      
      <main>
        <BlogPageHeader
          title={blogPost.title}
          excerpt={blogPost.excerpt}
          author={blogPost.author}
          date={blogPost.date}
          readTime={blogPost.readTime}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
        />
        
        <BlogFeaturedImage
          src={blogPost.featuredImage}
          alt={blogPost.title}
        />
        
        <BlogMainWrapper
          content={blogPost.content}
          tags={blogPost.tags}
          author={blogPost.author}
        />
        
        <BlogRelatedArticles
          articles={relatedArticles}
        />
      </main>
    </div>
  );
}