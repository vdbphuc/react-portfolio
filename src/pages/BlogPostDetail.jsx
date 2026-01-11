import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, MessageSquare, ExternalLink, MessageCircle } from 'lucide-react';

import { portfolioData } from '../data/portfolio';

const BlogPostDetail = () => {
    const { id } = useParams(); // Lấy ID bài viết từ URL
    const [post, setPost] = useState(null);

    const { githubUsername, repoName } = portfolioData.blog;

    useEffect(() => {
        fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/issues/${id}`)
            .then(res => res.json())
            .then(data => setPost(data))
            .catch(err => console.error(err));
    }, [id, githubUsername, repoName]);

    if (!post) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen max-w-4xl">
            {/* Nút quay lại */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-600 mb-8 hover:underline">
                <ArrowLeft size={20} /> Back to Blog
            </Link>

            <article className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-xl">
                {/* Header bài viết */}
                <header className="mb-10 border-b pb-8 dark:border-gray-700">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-500">
                        <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                        <a
                            href={post.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 hover:text-indigo-500 transition-colors"
                        >
                            <MessageSquare size={18} />
                            {post.comments} Comments on GitHub <ExternalLink size={14} />
                        </a>
                    </div>
                </header>

                {/* Nội dung Markdown */}
                <div className="prose dark:prose-invert max-w-none prose-lg prose-indigo">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.body}
                    </ReactMarkdown>
                </div>
            </article>

            {/* Nút kêu gọi Comment */}
            <div className="mt-10 text-center">
                <p className="mb-4 text-gray-600 dark:text-gray-400">Want to discuss this post?</p>
                <a
                    href={post.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all"
                >
                    Leave a comment on GitHub
                </a>
            </div>
            <div className="mt-10 pt-6 border-t dark:border-gray-700 text-center">
                <h3 className="text-xl font-bold mb-4">Thảo luận</h3>
                <p className="mb-6 text-gray-500">Bạn có thắc mắc hay góp ý? Hãy để lại bình luận nhé!</p>

                <a
                    href={post.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-3 rounded-full font-bold hover:opacity-80 transition-all"
                >
                    <MessageCircle size={20} />
                    Bình luận tại GitHub Issue này
                </a>
            </div>
        </div>
    );
};

export default BlogPostDetail;