namespace :db do
	desc "seed the db with ideology data"
	task ideology: :environment do
		response = HTTParty.get(
			'https://www.govtrack.us/data/us/113/stats/sponsorshipanalysis_s.txt')
		response.force_encoding("utf-8")
		puts "response: #{response}"
		lines = response.body.split("\n")
		lines.each_with_index do |line, line_num|
			 puts "#{line_num}: #{line}"
			 unless line_num == 0
				values = line.split(',')
				Conman.create(chamber: "Senate",
											govtrack_id: values[0].to_i,
										  ideology: values[1].to_i,
										  leadership: values[2].to_i,
										  name: values[3],
										  party: values[4],
										  description: values[5],
										  introduced_bills: values[6].to_i,
										  cosponsored_bills: values[7].to_i,
										  unique_cosponsors: values[8].to_i,
										  total_cosponsors: values[9].to_i)
			 end
		end
	end
end
