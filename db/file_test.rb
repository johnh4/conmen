require "json"

keys = []
sen_ideo = {}
File.foreach('sponsorshipanalysis_s.txt').with_index do |line, line_num|
   puts "#{line_num}: #{line}"
	 if line_num == 0
	 	keys = line.split(',').map { |k| k.gsub(/\s|\n/,"") }
		puts "keys: #{keys}"
	 else
	 	values = line.split(',')
		id = values[0]
		senator = {}
		keys.each_with_index do |key, i|
			senator[key.to_sym] = values[i].gsub(/\s|\n/,"")
		end
		sen_ideo[id.to_sym] = senator
		puts "sen_ideo[id.to_sym]: #{sen_ideo[id.to_sym]}"
	 end
	 puts "#senators: #{sen_ideo.length}"
end

meta = File.open( "sponsorshipanalysis_s_meta.txt", "r") do |f|
	JSON.load( f )
end
puts "meta.end_date: #{meta["end_date"]}"
sen_ideo[:meta] = meta["end_date"]
puts "sen_ideo[:meta]: #{sen_ideo[:meta]}"
