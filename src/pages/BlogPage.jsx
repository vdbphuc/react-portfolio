import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, MessageCircle, User } from 'lucide-react';

import { portfolioData } from '../data/portfolio';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { githubUsername, repoName } = portfolioData.blog;

    useEffect(() => {
        // Gọi API GitHub lấy danh sách Issues có label="blog"
        fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/issues?labels=blog&state=open`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => console.error("Lỗi fetch blog:", err));
    }, [githubUsername, repoName]);

    if (loading) return <div className="text-center py-20">Loading posts...</div>;

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white flex justify-center items-center gap-3">
                <BookOpen /> My Tech Blog
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link to={`/blog/${post.number}`} key={post.id} className="block group">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-transparent hover:border-indigo-500 h-full flex flex-col">

                            {/* Tiêu đề */}
                            <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                {post.title}
                            </h2>

                            {/* Tóm tắt (Cắt 100 ký tự đầu) */}
                            <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">
                                {(post.body || "Không có nội dung mô tả").slice(0, 150)}...
                            </p>

                            {/* Footer của Card */}
                            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(post.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageCircle size={16} />
                                    {post.comments} comments
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;