CREATE TABLE `t_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户名字',
  `title` varchar(256) COLLATE utf8_unicode_ci NOT NULL COMMENT '计划标题',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '计划详情',
  `avatar` varchar(256) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像',
  `costtime` int(4) NOT NULL COMMENT '计划准备消耗时间（小时）',
  `stat` tinyint(1) NOT NULL DEFAULT 1 COMMENT '计划状态，0：不显示（软删除），1：默认显示，2：完成的计划',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '计划创建时间',
  `ltime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '计划最后时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;